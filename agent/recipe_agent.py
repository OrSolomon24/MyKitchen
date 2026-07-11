# recipe_agent.py
from typing import Tuple, List

import httpx
from fastapi import HTTPException

from ai_client import invoke_model
from prompts import build_recipe_extraction_prompt


FETCH_HEADERS = {
    # Many recipe sites block requests with no/generic User-Agent.
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
}


async def fetch_html(url: str, timeout: float = 30.0) -> str:
    try:
        async with httpx.AsyncClient(timeout=timeout, headers=FETCH_HEADERS, follow_redirects=True) as client:
            r = await client.get(url)
            r.raise_for_status()
            return r.text
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {e}")


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

    # 3. Call the model (structured output, no manual JSON parsing needed)
    try:
        recipe = invoke_model(prompt)
    except Exception as e:
        import traceback
        print("[error] Model call failed:")
        traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"Recipe extraction service failed: {e}")

    ingredients = recipe.ingredients
    instructions = recipe.instructions
    if not ingredients and not instructions:
        print("[warning] Model returned empty ingredients & instructions for this URL.")

    return ingredients, instructions
