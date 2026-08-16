from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

# Create database tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Event Registration API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Welcome to the Event Registration API!"}

# Use Case 1: Register for an Event (POST)
@app.post("/api/register", response_model=schemas.RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: schemas.RegistrationCreate, db: Session = Depends(get_db)):
    new_registration = models.Registration(
        full_name=user_data.full_name,
        email=user_data.email,
        github_profile=user_data.github_profile,
        event_track=user_data.event_track
    )
    db.add(new_registration)
    db.commit()
    db.refresh(new_registration)
    return new_registration

# Use Case 2: List all Registrations (GET)
@app.get("/api/registrations", response_model=List[schemas.RegistrationResponse])
def get_all_registrations(db: Session = Depends(get_db)):
    registrations = db.query(models.Registration).all()
    return registrations

    # Use Case 3: Update an Attendee (PUT)
@app.put("/api/registrations/{registration_id}", response_model=schemas.RegistrationResponse)
def update_registration(
    registration_id: int, 
    updated_data: schemas.RegistrationCreate, 
    db: Session = Depends(get_db)
):
    db_user = db.query(models.Registration).filter(models.Registration.id == registration_id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    # Update fields
    db_user.full_name = updated_data.full_name
    db_user.email = updated_data.email
    db_user.github_profile = updated_data.github_profile
    db_user.event_track = updated_data.event_track
    
    db.commit()
    db.refresh(db_user)
    return db_user