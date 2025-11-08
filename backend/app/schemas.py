from typing import Optional, List, Dict
from pydantic import BaseModel

class EventIn(BaseModel):
    minute: Optional[int]
    second: Optional[int]
    team_id: Optional[int]
    player_id: Optional[int]
    type: str
    x: Optional[float]
    y: Optional[float]
    outcome: Optional[str]
    tags: Optional[Dict] = {}

class UploadMatchIn(BaseModel):
    external_id: Optional[str]
    date: str
    home_team: Dict
    away_team: Dict
    events: List[EventIn]
