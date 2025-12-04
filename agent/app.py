# app.py
from fastapi import FastAPI
from schemas import ParseRecipeRequest, ParseRecipeResponse
from recipe_agent import extract_recipe_from_url

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Recipe AI agent is running with Gemini"}


@app.post("/parse-recipe", response_model=ParseRecipeResponse)
async def parse_recipe(req: ParseRecipeRequest):
    # Delegate all logic to the "agent" function
    ingredients, instructions = await extract_recipe_from_url(
        url=str(req.url),
        name=req.name,
        description=req.description,
    )

    # Keep name & description EXACTLY as user sent them
    return ParseRecipeResponse(
        name=req.name,
        description=req.description,
        ingredients=ingredients,
        instructions=instructions,
    )
