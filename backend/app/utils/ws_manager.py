import asyncio
import json
from typing import Dict, List
from fastapi import WebSocket
import os

USE_REDIS_PUBSUB = os.getenv("USE_REDIS_PUBSUB", "false").lower() in ("1", "true", "yes")
if USE_REDIS_PUBSUB:
    import redis.asyncio as aioredis
    REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self._lock = asyncio.Lock()
        self._redis = None
        if USE_REDIS_PUBSUB:
            self._redis = aioredis.from_url(REDIS_URL)

    async def connect(self, websocket: WebSocket, room: str = "global"):
        await websocket.accept()
        async with self._lock:
            self.active_connections.setdefault(room, []).append(websocket)

    async def disconnect(self, websocket: WebSocket):
        async with self._lock:
            for room, conns in list(self.active_connections.items()):
                if websocket in conns:
                    conns.remove(websocket)
                    if not conns:
                        del self.active_connections[room]

    async def broadcast(self, room: str, message: dict):
        text = json.dumps(message)
        if USE_REDIS_PUBSUB and self._redis:
            await self._redis.publish(room, text)
        async with self._lock:
            conns = list(self.active_connections.get(room, []))
        for conn in conns:
            try:
                await conn.send_text(text)
            except Exception:
                pass

    async def start_redis_listener(self):
        if not (USE_REDIS_PUBSUB and self._redis):
            return
        pubsub = self._redis.pubsub()
        await pubsub.psubscribe("*")
        async def reader():
            async for message in pubsub.listen():
                if message is None:
                    continue
                mtype = message.get("type")
                if mtype in ("message", "pmessage"):
                    channel = message.get("channel")
                    data = message.get("data")
                    try:
                        if isinstance(channel, bytes):
                            channel = channel.decode()
                        if isinstance(data, bytes):
                            data = data.decode()
                        payload = json.loads(data)
                    except Exception:
                        continue
                    async with self._lock:
                        conns = list(self.active_connections.get(channel, []))
                    for conn in conns:
                        try:
                            await conn.send_text(json.dumps(payload))
                        except Exception:
                            pass
        asyncio.create_task(reader())

manager = ConnectionManager()
