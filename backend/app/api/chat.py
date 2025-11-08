from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from sqlmodel import Session, select
from ..database import engine
from ..models import Message
from ..utils.ws_manager import manager
import json
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api")

@router.websocket("/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        join_raw = await websocket.receive_text()
        try:
            join = json.loads(join_raw)
        except Exception:
            await websocket.close(code=1003)
            return
        room = join.get("room", "global")
        await manager.connect(websocket, room)
        await manager.start_redis_listener()

        await manager.broadcast(room, {
            "type":"system",
            "event":"user_join",
            "room": room,
            "user": {"sender_id": join.get("sender_id"), "sender_name": join.get("sender_name")},
            "ts": datetime.utcnow().isoformat()
        })

        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
            except Exception:
                continue
            if payload.get("type") == "message":
                content = payload.get("content", "")
                sender_id = payload.get("sender_id")
                sender_name = payload.get("sender_name")
                room = payload.get("room", room)
                with Session(engine) as session:
                    msg = Message(
                        room=room,
                        sender_id=sender_id,
                        sender_name=sender_name,
                        content=content,
                        created_at=datetime.utcnow()
                    )
                    session.add(msg)
                    session.commit()
                    session.refresh(msg)
                    out = {
                        "type":"message",
                        "id": msg.id,
                        "room": msg.room,
                        "sender_id": msg.sender_id,
                        "sender_name": msg.sender_name,
                        "content": msg.content,
                        "created_at": msg.created_at.isoformat()
                    }
                await manager.broadcast(room, out)
            elif payload.get("type") == "ping":
                await websocket.send_text(json.dumps({"type":"pong"}))
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception:
        try:
            await manager.disconnect(websocket)
        except Exception:
            pass
        try:
            await websocket.close()
        except Exception:
            pass

@router.get("/chat/{room}/messages", response_model=List[dict])
def get_messages(room: str, limit: int = 100):
    with Session(engine) as session:
        q = session.exec(select(Message).where(Message.room == room).order_by(Message.created_at.desc()).limit(limit))
        rows = q.all()
        rows = list(reversed(rows))
        result = [{
            "id": r.id,
            "room": r.room,
            "sender_id": r.sender_id,
            "sender_name": r.sender_name,
            "content": r.content,
            "created_at": r.created_at.isoformat()
        } for r in rows]
        return result

@router.post("/chat/{room}/message")
def post_message(room: str, payload: dict):
    sender_id = payload.get("sender_id")
    sender_name = payload.get("sender_name")
    content = payload.get("content")
    if not content:
        raise HTTPException(status_code=400, detail="content required")
    with Session(engine) as session:
        msg = Message(room=room, sender_id=sender_id, sender_name=sender_name, content=content)
        session.add(msg)
        session.commit()
        session.refresh(msg)
        out = {
            "type":"message",
            "id": msg.id,
            "room": msg.room,
            "sender_id": msg.sender_id,
            "sender_name": msg.sender_name,
            "content": msg.content,
            "created_at": msg.created_at.isoformat()
        }
    import asyncio
    asyncio.create_task(manager.broadcast(room, out))
    return out
