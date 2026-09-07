from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


TicketStatus = Literal[
    "open",
    "in_progress",
    "resolved",
    "closed",
]

TicketPriority = Literal[
    "low",
    "medium",
    "high",
    "urgent",
]


class TicketCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200,
    )

    description: str = Field(
        min_length=5,
        max_length=5000,
    )

    priority: TicketPriority = "medium"


class TicketUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=3,
        max_length=200,
    )

    description: str | None = Field(
        default=None,
        min_length=5,
        max_length=5000,
    )

    status: TicketStatus | None = None

    priority: TicketPriority | None = None


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )