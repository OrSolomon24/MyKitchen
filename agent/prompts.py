# prompts.py
import re

# Regular <script>/<style>/etc. are pure byte bloat (webpack bundles, analytics,
# icon sprites) with zero recipe-relevant text. On JS-heavy pages they can push
# the actual recipe content -- often a JSON-LD <script type="application/ld+json">
# block -- past the prompt's truncation cutoff, so the model never even sees it.
# <script type="application/ld+json"> is deliberately excluded from stripping
# since that's exactly where structured recipe data usually lives.
_NOISE_TAG_RE = re.compile(r"<script(?![^>]*ld\+json)[^>]*>.*?</script>", re.IGNORECASE | re.DOTALL)
_OTHER_NOISE_TAG_RE = re.compile(r"<(style|noscript|svg)\b[^>]*>.*?</\1>", re.IGNORECASE | re.DOTALL)


def _strip_noise(html: str) -> str:
    cleaned = _NOISE_TAG_RE.sub("", html)
    return _OTHER_NOISE_TAG_RE.sub("", cleaned)


def build_recipe_extraction_prompt(
    html: str, user_name: str, user_description: str, target_language: str = "Hebrew"
) -> str:
    """
    Returns a single prompt string to send to the model.
    We keep it in one place so it's easy to tweak.
    """
    html = _strip_noise(html)
    system_instructions = f"""
You are an assistant that extracts cooking recipes from raw HTML pages.
The HTML may be in any language (including Hebrew). You MUST try your best
to find a recipe if there is any hint of one.

You MUST return a JSON object with this exact structure:

{{
  "ingredients": ["string", "string", ...],
  "instructions": ["step 1", "step 2", ...]
}}

Rules:
- "ingredients" is a flat list of strings, one ingredient per item.
- Each ingredient string MUST include its quantity/amount exactly as written in
  the source (e.g. "2 eggs", "250ml milk", "1 tsp vanilla extract"), not just
  the ingredient name on its own.
- Only include a quantity if the source text actually specifies one. If no
  amount is given for an ingredient, output just the ingredient name -- do NOT
  invent, guess, or assume a quantity that isn't written.
- "instructions" is a flat ordered list of steps.
- You MUST return all ingredients and instructions in {target_language}, even if the original recipe is in another language. Translate them to {target_language} if needed.
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

{html[:60000]}
(HTML may be truncated.)
"""

    return system_instructions.strip() + "\n\n" + user_context.strip()
