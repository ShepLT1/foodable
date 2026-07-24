from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.lists import router as lists_router
from app.api.routes.recipes import router as recipes_router
from app.api.routes.users import router as users_router
from app.middleware.cors import add_cors

app = FastAPI(
    title="Foodable",
    version="1.0.0",
)

add_cors(app)

app.include_router(health_router)
app.include_router(users_router)
app.include_router(lists_router)
app.include_router(recipes_router)
