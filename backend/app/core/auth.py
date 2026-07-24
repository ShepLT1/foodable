import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWKClient

from app.core.config import settings
from app.schemas import CurrentUser

_jwks_client = PyJWKClient(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")

# Points Swagger UI to our new /token login route
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token", auto_error=False)


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
) -> CurrentUser:
    if token is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "missing bearer token")

    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
        )
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid or expired token")

    email = claims.get("email")

    if email is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing email from token")

    return CurrentUser(id=claims["sub"], email=email)
