from typing import Optional
from sqlmodel import SQLModel, Field, Column
from datetime import datetime
from sqlalchemy import JSON, TIMESTAMP, text


class Team(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    league: Optional[str] = None
    country: Optional[str] = None


class Player(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    birthdate: Optional[str] = None
    position: Optional[str] = None
    nationality: Optional[str] = None


class Match(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: str
    home_team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    away_team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    stadium: Optional[str] = None
    status: Optional[str] = "finished"


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    match_id: int = Field(foreign_key="match.id")
    minute: Optional[int] = None
    second: Optional[int] = None
    team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    player_id: Optional[int] = Field(default=None, foreign_key="player.id")
    type: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None
    outcome: Optional[str] = None
    tags: Optional[dict] = Field(sa_column=Column(JSON), default=None)
    xg: Optional[float] = None


class PlayerStatsPerMatch(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    player_id: int = Field(foreign_key="player.id")
    match_id: int = Field(foreign_key="match.id")
    minutes: Optional[int] = None
    goals: Optional[int] = None
    assists: Optional[int] = None
    xg: Optional[float] = None
    xa: Optional[float] = None
    passes: Optional[int] = None
    progressive_passes: Optional[int] = None


class Message(SQLModel, table=True):
    __tablename__ = "messages"
    id: Optional[int] = Field(default=None, primary_key=True)
    room: Optional[str] = Field(default="global", index=True)
    sender_id: Optional[int] = Field(default=None)
    sender_name: Optional[str] = Field(default=None)
    content: str
    meta_data: Optional[dict] = Field(
        default={},
        sa_column=Column(JSON),
        alias="metadata"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    )


class SupportTicket(SQLModel, table=True):
    __tablename__ = "support_tickets"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None)
    user_email: Optional[str] = Field(default=None)
    subject: str
    description: str
    status: str = Field(default="open")
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    )
    meta_data: Optional[dict] = Field(
        default={},
        sa_column=Column(JSON),
        alias="metadata"
    )


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    username: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
