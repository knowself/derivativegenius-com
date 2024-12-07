from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from pydantic import BaseModel

router = APIRouter()
security = HTTPBearer()

class UserToken(BaseModel):
    token: str

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid authentication credentials: {str(e)}"
        )

@router.post("/verify")
async def verify_firebase_token(token: UserToken):
    try:
        decoded_token = auth.verify_id_token(token.token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False)
        }
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}"
        )

@router.get("/user")
async def get_user_info(token: dict = Depends(verify_token)):
    try:
        user = auth.get_user(token["uid"])
        return {
            "uid": user.uid,
            "email": user.email,
            "display_name": user.display_name,
            "photo_url": user.photo_url,
            "email_verified": user.email_verified
        }
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=f"User not found: {str(e)}"
        )
