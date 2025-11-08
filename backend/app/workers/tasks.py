from .celery_app import celery_app
from ..database import engine
from sqlmodel import Session
from .. import crud
from ..models import Match, Event
from datetime import date, datetime
import asyncio

@celery_app.task(bind=True)
def process_match_payload(self, payload):
    with Session(engine) as session:
        try:
            match = crud.create_match_with_events(session, payload)
            return {"status": "ok", "match_id": match.id}
        except Exception as e:
            return {"status": "error", "error": str(e)}

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # agendar ingestão diária (24h) - placeholder
    sender.add_periodic_task(24*3600.0, ingest_daily_matches.s(), name="ingest daily matches")

@celery_app.task
def ingest_daily_matches():
    # função placeholder: aqui você ligará o conector da API de futebol
    print("Executando ingestão diária de partidas - placeholder")
