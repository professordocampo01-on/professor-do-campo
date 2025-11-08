from sqlmodel import create_engine, Session
import os

DATABASE_URL = os.getenv("DATABASE_URL", os.getenv("DATABASE_URL", "postgresql+psycopg2://pdoc:pdocpass@localhost:5432/pdoc_db"))
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

def get_session():
    with Session(engine) as session:
        yield session
