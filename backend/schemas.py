from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# Input schema (Data expected from the frontend/user)
class RegistrationCreate(BaseModel):
    full_name: str
    email: str
    github_profile: Optional[str] = None
    event_track: str

# Output schema (Data returned back to the user)
class RegistrationResponse(BaseModel):
    id: int
    full_name: str
    email: str
    github_profile: Optional[str]
    event_track: str
    registered_at: datetime

    class Config:
        from_attributes = True