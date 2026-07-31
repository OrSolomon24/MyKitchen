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
        description=(
            "Flat list of ingredient strings, one ingredient per item. Each string "
            "MUST include the quantity/amount exactly as stated in the source "
            "(e.g. '2 eggs', '250ml milk'), not just the bare ingredient name. "
            "Only include a quantity if the source actually specifies one -- "
            "never invent or assume an amount that isn't written."
        )
    )
    instructions: List[str] = Field(
        description="Ordered list of instruction steps."
    )
