import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings

router = APIRouter(tags=["auth"])


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> dict[str, str]:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.supabase_url}/auth/v1/token?grant_type=password",
            headers={
                "apikey": os.getenv(
                    "SUPABASE_PUBLISHABLE_KEY",
                    "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH",
                )
            },
            json={"email": form_data.username, "password": form_data.password},
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    data = response.json()
    return {
        "access_token": data["access_token"],
        "token_type": "bearer",
    }
