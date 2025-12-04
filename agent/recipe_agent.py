# recipe_agent.py
import json
from typing import Tuple, List

import httpx
from fastapi import HTTPException

from ai_client import invoke_gemini
from prompts import build_recipe_extraction_prompt


async def fetch_html(url: str, timeout: float = 30.0) -> str:
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            r = await client.get(url)
            r.raise_for_status()
            return r.text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {e}")


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

    try:
        data = json.loads(cleaned)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse JSON from model: {e}. Raw: {cleaned[:200]}",
        )

    return data


async def extract_recipe_from_url(url: str, name: str, description: str) -> Tuple[List[str], List[str]]:
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
    prompt = build_recipe_extraction_prompt(html, name, description)

    # 3. Call Gemini
    try:
        raw = invoke_gemini(prompt)
    except Exception as e:
        import traceback
        print("❌ Error calling Gemini:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini call failed: {e}")

    print("🔎 Raw Gemini output (first 300 chars):")
    print(raw[:300])

    # 4. Parse JSON
    recipe = clean_model_json_output(raw)

    ingredients = recipe.get("ingredients") or []
    instructions = recipe.get("instructions") or []

    if not isinstance(ingredients, list):
        ingredients = []
    if not isinstance(instructions, list):
        instructions = []

    ingredients = [str(x) for x in ingredients]
    instructions = [str(x) for x in instructions]
    if not ingredients and not instructions:
        print("⚠️ Gemini returned empty ingredients & instructions for this URL.")

    return ingredients, instructions
