from fastapi import FastAPI

from app.core.database import Base, engine
from app.models.user import User
from app.models.ticket import Ticket
from app.routers.auth import router as auth_router
from app.routers.tickets import router as tickets_router
from app.routers.users import router as users_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Support Desk",
    description="Professional AI-powered customer support platform built with FastAPI.",
    version="1.0.0",
)


app.include_router(users_router)
app.include_router(auth_router)
app.include_router(tickets_router)


@app.get("/")
def home():
    return {
        "message": "AI Support Desk API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }