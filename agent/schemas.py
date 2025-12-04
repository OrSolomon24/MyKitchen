# schemas.py
from typing import List
from pydantic import BaseModel, HttpUrl


class ParseRecipeRequest(BaseModel):
    url: HttpUrl
    name: str
    description: str


class ParseRecipeResponse(BaseModel):
    name: str
    description: str
    ingredients: List[str]
    instructions: List[str]
