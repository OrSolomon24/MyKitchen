# recipe_agent.py
import json
from typing import Tuple, List

import httpx
from fastapi import HTTPException

from ai_client import invoke_gemini
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


class RecipeExtractionError(Exception):
    """Raised when the model's output can't be turned into a recipe."""


def clean_model_json_output(raw_text: str) -> dict:
    """
    Remove ```json / ``` fences if present and parse JSON.
    Returns a Python dict.
    """
    cleaned = raw_text.strip()

    # Strip markdown fences like ```json ... ``` or ``` ... ```
    if cleaned.startswith("```"):
        first_newline = cleaned.find("\n")
        if first_newline != -1:
            cleaned = cleaned[first_newline + 1 :]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

    if not cleaned:
        raise RecipeExtractionError("Model returned an empty response")

    try:
        data = json.loads(cleaned)
    except Exception as e:
        raise RecipeExtractionError(f"Model did not return valid JSON: {e}")

    if not isinstance(data, dict):
        raise RecipeExtractionError("Model JSON output was not an object")

    return data


async def extract_recipe_from_url(
    url: str, name: str, description: str, target_language: str = "Hebrew"
) -> Tuple[List[str], List[str]]:
    """
    High-level 'agent' function:
    - Fetch HTML
    - Build prompt
    - Invoke Gemini
    - Clean and parse JSON
    - Return (ingredients, instructions)
    """
    # 1. Fetch HTML
    html = await fetch_html(url)

    # 2. Build prompt
    prompt = build_recipe_extraction_prompt(html, name, description, target_language)

    # 3. Call Gemini
    try:
        raw = invoke_gemini(prompt)
    except Exception as e:
        import traceback
        print("[error] Gemini call failed:")
        traceback.print_exc()
        raise HTTPException(status_code=502, detail=f"Recipe extraction service failed: {e}")

    print("[debug] Raw Gemini output (first 300 chars):")
    print(raw[:300])

    # 4. Parse JSON
    try:
        recipe = clean_model_json_output(raw)
    except RecipeExtractionError as e:
        print(f"[warning] {e}. Raw (first 200 chars): {raw[:200]}")
        raise HTTPException(
            status_code=502,
            detail="Could not extract a recipe from this page. Try a different URL or enter it manually.",
        )

    ingredients = recipe.get("ingredients") or []
    instructions = recipe.get("instructions") or []

    if not isinstance(ingredients, list):
        ingredients = []
    if not isinstance(instructions, list):
        instructions = []

    ingredients = [str(x) for x in ingredients]
    instructions = [str(x) for x in instructions]
    if not ingredients and not instructions:
        print("[warning] Gemini returned empty ingredients & instructions for this URL.")

    return ingredients, instructions
