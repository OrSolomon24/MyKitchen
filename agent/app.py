# app.py
import sys

# Recipe output can contain non-ASCII text (e.g. Hebrew) that gets printed to
# stdout for debugging. On some platforms/locales (notably plain Windows
# consoles) the default stdout encoding can't represent that and printing
# crashes the request. Force UTF-8 defensively, regardless of environment.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi import FastAPI
from schemas import ParseRecipeRequest, ParseRecipeResponse
from recipe_agent import extract_recipe_from_url

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Recipe AI agent is running"}


@app.post("/parse-recipe", response_model=ParseRecipeResponse)
async def parse_recipe(req: ParseRecipeRequest):
    # Delegate all logic to the "agent" function
    ingredients, instructions = await extract_recipe_from_url(
        url=str(req.url),
        name=req.name,
        description=req.description,
        target_language=req.target_language,
    )

    # Keep name & description EXACTLY as user sent them
    return ParseRecipeResponse(
        name=req.name,
        description=req.description,
        ingredients=ingredients,
        instructions=instructions,
    )
