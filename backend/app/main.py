from fastapi import FastAPI
from app.middleware.cors import add_cors

from app.api.routes.health import router as health_router
from app.api.routes.users import router as users_router

app = FastAPI(
    title="Foodable",
    version="1.0.0",
)

add_cors(app)

app.include_router(health_router)
app.include_router(users_router)
