from sqlmodel import select
from .models import Team, Player, Match, Event
from sqlmodel import Session
from .database import engine

def get_or_create_team(session: Session, team_data):
    q = session.exec(select(Team).where(Team.name == team_data.get("name")))
    team = q.first()
    if not team:
        team = Team(name=team_data.get("name"), league=team_data.get("league"))
        session.add(team)
        session.commit()
        session.refresh(team)
    return team

def create_match_with_events(session: Session, match_data):
    home = get_or_create_team(session, match_data["home_team"])
    away = get_or_create_team(session, match_data["away_team"])
    match = Match(date=match_data["date"], home_team_id=home.id, away_team_id=away.id)
    session.add(match)
    session.commit()
    session.refresh(match)
    for e in match_data.get("events", []):
        event = Event(match_id=match.id, minute=e.get('minute'), second=e.get('second'),
                      team_id=e.get('team_id'), player_id=e.get('player_id'), type=e.get('type'),
                      x=e.get('x'), y=e.get('y'), outcome=e.get('outcome'), tags=e.get('tags'))
        session.add(event)
    session.commit()
    return match
