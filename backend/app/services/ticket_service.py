from sqlalchemy.orm import Session

from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate


def create_ticket(
    db: Session,
    ticket_data: TicketCreate,
    owner_id: int,
) -> Ticket:

    ticket = Ticket(
        title=ticket_data.title,
        description=ticket_data.description,
        priority=ticket_data.priority,
        owner_id=owner_id,
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket


def get_user_tickets(
    db: Session,
    owner_id: int,
) -> list[Ticket]:

    return (
        db.query(Ticket)
        .filter(Ticket.owner_id == owner_id)
        .order_by(Ticket.created_at.desc())
        .all()
    )


def get_ticket_by_id(
    db: Session,
    ticket_id: int,
    owner_id: int,
) -> Ticket | None:

    return (
        db.query(Ticket)
        .filter(
            Ticket.id == ticket_id,
            Ticket.owner_id == owner_id,
        )
        .first()
    )


def update_ticket(
    db: Session,
    ticket: Ticket,
    ticket_data: TicketUpdate,
) -> Ticket:

    update_data = ticket_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(ticket, field, value)

    db.commit()
    db.refresh(ticket)

    return ticket


def delete_ticket(
    db: Session,
    ticket: Ticket,
) -> None:

    db.delete(ticket)
    db.commit()