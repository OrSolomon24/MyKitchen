# schemas.py
from typing import List
from pydantic import BaseModel, Field, HttpUrl


class ParseRecipeRequest(BaseModel):
    url: HttpUrl
    name: str
    description: str
    target_language: str = "Hebrew"


class ParseRecipeResponse(BaseModel):
    name: str
    description: str
    ingredients: List[str]
    instructions: List[str]


class RecipeExtraction(BaseModel):
    """A recipe's ingredients and instructions, extracted from a web page."""

    ingredients: List[str] = Field(
        description="Flat list of ingredient strings, one ingredient per item."
    )
    instructions: List[str] = Field(
        description="Ordered list of instruction steps."
    )
