from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    github_profile = Column(String, nullable=True)
    event_track = Column(String, nullable=False)
    registered_at = Column(DateTime, default=datetime.utcnow)