from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.ticket import (
    TicketCreate,
    TicketResponse,
    TicketUpdate,
)
from app.services.ai_service import (
    AIServiceError,
    analyze_ticket,
    generate_ticket_response,
)
from app.services.ticket_service import (
    create_ticket,
    delete_ticket,
    get_ticket_by_id,
    get_user_tickets,
    update_ticket,
)


router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


@router.post(
    "",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_ticket(
        db=db,
        ticket_data=ticket_data,
        owner_id=current_user.id,
    )


@router.get(
    "",
    response_model=list[TicketResponse],
)
def list_my_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_tickets(
        db=db,
        owner_id=current_user.id,
    )


@router.post(
    "/{ticket_id}/ai-response",
    status_code=status.HTTP_200_OK,
)
def generate_ai_response_for_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
        owner_id=current_user.id,
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    try:
        ai_response = generate_ticket_response(
            title=ticket.title,
            description=ticket.description,
            priority=ticket.priority,
        )

    except AIServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    return {
        "ticket_id": ticket.id,
        "title": ticket.title,
        "priority": ticket.priority,
        "ai_response": ai_response,
    }


@router.post(
    "/{ticket_id}/ai-analyze",
    status_code=status.HTTP_200_OK,
)
def analyze_ticket_with_ai(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
        owner_id=current_user.id,
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    try:
        analysis = analyze_ticket(
            title=ticket.title,
            description=ticket.description,
            priority=ticket.priority,
        )

    except AIServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    return {
        "ticket_id": ticket.id,
        "title": ticket.title,
        "original_priority": ticket.priority,
        "category": analysis["category"],
        "urgency": analysis["urgency"],
        "summary": analysis["summary"],
        "sentiment": analysis["sentiment"],
        "suggested_response": analysis["suggested_response"],
    }


@router.get(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def get_my_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
        owner_id=current_user.id,
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    return ticket


@router.patch(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def update_my_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
        owner_id=current_user.id,
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    return update_ticket(
        db=db,
        ticket=ticket,
        ticket_data=ticket_data,
    )


@router.delete(
    "/{ticket_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_my_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket = get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
        owner_id=current_user.id,
    )

    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    delete_ticket(
        db=db,
        ticket=ticket,
    )

    return None