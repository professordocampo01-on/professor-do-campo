import csv
from io import StringIO

def parse_events_csv(content_bytes):
    text = content_bytes.decode()
    f = StringIO(text)
    reader = csv.DictReader(f)
    events = []
    for row in reader:
        events.append({
            "minute": int(row.get("minute") or 0),
            "second": int(row.get("second") or 0),
            "team_id": int(row.get("team_id")) if row.get("team_id") else None,
            "player_id": int(row.get("player_id")) if row.get("player_id") else None,
            "type": row.get("type"),
            "x": float(row.get("x")) if row.get("x") else None,
            "y": float(row.get("y")) if row.get("y") else None,
            "outcome": row.get("outcome"),
            "tags": {}
        })
    return events
