# prompts.py

def build_recipe_extraction_prompt(html: str, user_name: str, user_description: str) -> str:
    """
    Returns a single prompt string to send to Gemini.
    We keep it in one place so it's easy to tweak.
    """
    system_instructions = """
You are an assistant that extracts cooking recipes from raw HTML pages.
The HTML may be in any language (including Hebrew). You MUST try your best
to find a recipe if there is any hint of one.

You MUST return a JSON object with this exact structure:

{
  "ingredients": ["string", "string", ...],
  "instructions": ["step 1", "step 2", ...]
}

Rules:
- "ingredients" is a flat list of strings, one ingredient per item.
- "instructions" is a flat ordered list of steps.
- You MUST return all ingredients and instructions in Hebrew, even if the original recipe is in another language. Translate them to Hebrew if needed.
- Do NOT add "name" or "description" fields (the caller already has them).
- Do NOT include any comments or extra keys.
- Output MUST be STRICT valid JSON, no extra text before or after.
- Do NOT wrap the JSON in ``` or ```json or any other markdown formatting.
- Avoid returning empty lists. If there is any textual hint of ingredients or steps,
  infer and output the best structured version you can.
"""

    user_context = f"""
The user provided:
- Recipe name: {user_name}
- Recipe description: {user_description}

Now extract the recipe from this HTML. Try HARD to find ingredients and steps:

{html[:40000]}
(HTML may be truncated.)
"""

    return system_instructions.strip() + "\n\n" + user_context.strip()
