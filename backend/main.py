import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.routers import auth, tickets, users


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Support Desk API",
    version="1.0.0",
)


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://ai-support-desk-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Support Desk API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


app.include_router(users.router)
app.include_router(auth.router)
app.include_router(tickets.router)