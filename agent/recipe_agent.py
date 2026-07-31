# recipe_agent.py
import asyncio
from typing import Tuple, List

import httpx
from fastapi import HTTPException

from ai_client import invoke_model
from prompts import build_recipe_extraction_prompt


FETCH_HEADERS = {
    # A bare User-Agent with no other browser-typical headers is itself a bot
    # signal to services like Radware/Akamai/Cloudflare bot management; send
    # the full set a real Chrome navigation would include.
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
    "sec-ch-ua": '"Chromium";v="124", "Not:A-Brand";v="24", "Google Chrome";v="124"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
}

# Markers seen on known bot-protection interstitials (e.g. Radware's
# "validate.perfdrive.com" redirect / "Radware Block Page"). httpx follows the
# redirect for us, so we have to inspect where we *landed*, not the status code.
BOT_CHALLENGE_HOST_MARKERS = ("perfdrive.com",)
BOT_CHALLENGE_CONTENT_MARKERS = ("radware block page", "botmanager_support@radware.com")


def _is_bot_challenge(response: httpx.Response) -> bool:
    host = response.url.host or ""
    if any(marker in host for marker in BOT_CHALLENGE_HOST_MARKERS):
        return True
    sample = response.text[:4000].lower()
    return any(marker in sample for marker in BOT_CHALLENGE_CONTENT_MARKERS)


async def fetch_html(url: str, timeout: float = 30.0, max_attempts: int = 3) -> str:
    last_error = "blocked by the site's bot-protection challenge page"
    for attempt in range(max_attempts):
        try:
            async with httpx.AsyncClient(timeout=timeout, headers=FETCH_HEADERS, follow_redirects=True) as client:
                r = await client.get(url)
                r.raise_for_status()
                if _is_bot_challenge(r):
                    if attempt < max_attempts - 1:
                        print(f"[warning] Bot-protection challenge detected for {url}, retrying ({attempt + 1}/{max_attempts})...")
                        await asyncio.sleep(1.5 * (attempt + 1))
                        continue
                    raise HTTPException(
                        status_code=502,
                        detail=f"Failed to fetch URL: {last_error}",
                    )
                return r.text
        except HTTPException:
            raise
        except Exception as e:
            last_error = str(e)
            if attempt < max_attempts - 1:
                await asyncio.sleep(1.5 * (attempt + 1))
                continue
            raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {last_error}")


async def extract_recipe_from_url(
    url: str, name: str, description: str, target_language: str = "Hebrew"
) -> Tuple[List[str], List[str]]:
    """
    High-level 'agent' function:
    - Fetch HTML
    - Build prompt
    - Invoke the model (structured output)
    - Return (ingredients, instructions)
    """
    # 1. Fetch HTML
    html = await fetch_html(url)

    # 2. Build prompt
    prompt = build_recipe_extraction_prompt(html, name, description, target_language)

    # 3. Call the model (structured output, no manual JSON parsing needed).
    # Free-tier OpenRouter models occasionally degrade to an empty-but-valid
    # completion under load instead of raising an error, so a blank result is
    # retried a couple of times before we treat it as "no recipe found".
    max_model_attempts = 3
    ingredients: List[str] = []
    instructions: List[str] = []
    for attempt in range(max_model_attempts):
        try:
            recipe = invoke_model(prompt)
        except Exception as e:
            import traceback
            print("[error] Model call failed:")
            traceback.print_exc()
            raise HTTPException(status_code=502, detail=f"Recipe extraction service failed: {e}")

        ingredients = recipe.ingredients
        instructions = recipe.instructions
        if ingredients or instructions:
            break
        if attempt < max_model_attempts - 1:
            print(f"[warning] Model returned empty ingredients & instructions, retrying ({attempt + 1}/{max_model_attempts})...")
            await asyncio.sleep(1.5 * (attempt + 1))

    if not ingredients and not instructions:
        print("[warning] Model returned empty ingredients & instructions for this URL after retries.")

    return ingredients, instructions
