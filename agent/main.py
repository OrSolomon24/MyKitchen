import os
import json
from typing import Dict, Any, TypedDict, List
from dotenv import load_dotenv

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl

from langgraph.graph import StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()  # loads variables from .env automatically

# =========================
# Config
# =========================

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY environment variable is required")

# LangChain Gemini model (you can change model name if you want)
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0.1,
)

# =========================
# LangGraph state & node
# =========================

class RecipeState(TypedDict):
    html: str
    user_name: str
    user_description: str
    recipe: Dict[str, Any]


def extract_recipe_node(state: RecipeState) -> RecipeState:
    """Node that calls Gemini to extract recipe JSON from HTML."""
    html = state["html"]
    user_name = state["user_name"]
    user_description = state["user_description"]

    system_prompt = """
You are an assistant that extracts clean cooking recipes from raw HTML pages.

You MUST return a JSON object with this exact structure:

{
  "ingredients": ["string", "string", ...],
  "instructions": ["step 1", "step 2", ...]
}

Rules:
- "ingredients" is a flat list of strings, one ingredient per item.
- "instructions" is a flat ordered list of steps.
- Do NOT add "name" or "description" fields (the caller already has them).
- Do NOT include any comments or extra keys.
- Output MUST be STRICT valid JSON, no extra text before or after.
"""

    user_prompt = f"""
The user provided:
- Recipe name: {user_name}
- Recipe description: {user_description}

Now extract the recipe from this HTML:

{html[:15000]}
(HTML may be truncated.)
"""

    try:
        resp = model.invoke(
            [
                ("system", system_prompt),
                ("user", user_prompt),
            ]
        )
    except Exception as e:
        import traceback
        print("❌ Error calling Gemini:")
        traceback.print_exc()
        raise RuntimeError(f"Gemini call failed: {e}")

    content = resp.content

    if isinstance(content, list):
        text = "".join(getattr(block, "text", str(block)) for block in content)
    else:
        text = str(content)

    print("🔎 Raw Gemini output (first 300 chars):")
    print(text[:300])

    try:
        recipe = json.loads(text)
    except Exception as e:
        raise RuntimeError(f"Failed to parse JSON from model: {e}. Raw: {text[:500]}")

    if "ingredients" not in recipe:
        recipe["ingredients"] = []
    if "instructions" not in recipe:
        recipe["instructions"] = []

    state["recipe"] = recipe
    return state




# Build the graph
# Build the graph (single-node graph, "extract" is the entry point)
graph_builder = StateGraph(RecipeState)
graph_builder.add_node("extract", extract_recipe_node)
graph_builder.set_entry_point("extract")
recipe_graph = graph_builder.compile()


# =========================
# FastAPI models & app
# =========================

class ParseRecipeRequest(BaseModel):
    url: HttpUrl
    name: str
    description: str


class ParseRecipeResponse(BaseModel):
    name: str
    description: str
    ingredients: List[str]
    instructions: List[str]


app = FastAPI()


@app.get("/")
def home():
    return {"message": "Agent service is running with LangGraph + Gemini"}


@app.post("/parse-recipe", response_model=ParseRecipeResponse)
async def parse_recipe(req: ParseRecipeRequest):
    # 1. Fetch HTML from the URL
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.get(str(req.url))
            r.raise_for_status()
            html = r.text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {e}")

    # 2. Run through LangGraph + Gemini to get structured recipe
    try:
        result = recipe_graph.invoke(
            {
                "html": html,
                "user_name": req.name,
                "user_description": req.description,
                "recipe": {},
            }
        )
        recipe = result["recipe"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI extraction failed: {e}")

    ingredients = recipe.get("ingredients") or []
    instructions = recipe.get("instructions") or []

    # Make sure they're lists of strings
    if not isinstance(ingredients, list):
        ingredients = []
    if not isinstance(instructions, list):
        instructions = []

    ingredients = [str(x) for x in ingredients]
    instructions = [str(x) for x in instructions]

    # 🔴 IMPORTANT: keep name & description EXACTLY as user sent
    return ParseRecipeResponse(
        name=req.name,
        description=req.description,
        ingredients=ingredients,
        instructions=instructions,
    )
