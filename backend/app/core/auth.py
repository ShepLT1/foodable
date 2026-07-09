import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import settings
from app.schemas import AuthUser

# jwks client will cache the JWK set for 5m by default (`lifespan` param),
# which prevents us needing to fetch it on each request to validate every call
_jwks_client = PyJWKClient(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")

_bearer = HTTPBearer(auto_error=False)


# verifies the Authorization header and returns the decoded JWT payload
# reference: https://fastapi.tiangolo.com/tutorial/security/get-current-user/
def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> AuthUser:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "missing bearer token")

    try:
        signing_key = _jwks_client.get_signing_key_from_jwt(credentials.credentials)
        claims = jwt.decode(
            credentials.credentials,
            signing_key.key,
            algorithms=["ES256", "RS256"],
            audience="authenticated",
        )
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid or expired token")
    
    email = claims.get("email")

    if email is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing email from token")

    return AuthUser(id=claims["sub"], email=email)
