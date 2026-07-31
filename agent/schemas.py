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

    # default_factory=list (not a bare required field) so a malformed/partial
    # model response -- e.g. some free-tier backends occasionally emit "{}"
    # instead of a schema-conforming object -- still parses successfully as
    # "nothing found" rather than raising a hard pydantic ValidationError that
    # bypasses the empty-result retry logic in recipe_agent.py.
    ingredients: List[str] = Field(
        default_factory=list,
        description=(
            "Flat list of ingredient strings, one ingredient per item. Each string "
            "MUST include the quantity/amount exactly as stated in the source "
            "(e.g. '2 eggs', '250ml milk'), not just the bare ingredient name. "
            "Only include a quantity if the source actually specifies one -- "
            "never invent or assume an amount that isn't written."
        )
    )
    instructions: List[str] = Field(
        default_factory=list,
        description="Ordered list of instruction steps.",
    )
