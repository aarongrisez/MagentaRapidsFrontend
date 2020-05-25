from fastapi import FastAPI, WebSocket
from starlette.websockets import WebSocket, WebSocketDisconnect
from typing import List, Union
from pydantic import BaseModel, parse_obj_as
import logging

logger = logging.getLogger("api")
logger.setLevel(logging.DEBUG)
app = FastAPI()

class Message(BaseModel):
    channel: int
    note: Union[str, List]
    duration: str
    time: str
    velocity: str

class MessageList(BaseModel):
    __root__: List[Message]

class Notifier:
    def __init__(self):
        self.connections: List[WebSocket] = []
        self.generator = self.get_notification_generator()

    async def get_notification_generator(self):
        while True:
            message = yield
            await self._notify(message)

    async def push(self, msg: Message):
        await self.generator.asend(msg)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def remove(self, websocket: WebSocket):
        self.connections.remove(websocket)

    async def _notify(self, messages: MessageList):
        living_connections = []
        while len(self.connections) > 0:
            # Looping like this is necessary in case a disconnection is handled
            # during await websocket.send_text(message)
            websocket = self.connections.pop()
            await websocket.send_text(messages.json())
            living_connections.append(websocket)
        self.connections = living_connections


notifier = Notifier()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await notifier.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if data: 
                try:
                    await notifier.push(MessageList.parse_obj(data)) 
                except Exception as e:
                    logger.error(f"Validation error: {e}")
                    logger.error(f"Invalid message format: {data}")
    except WebSocketDisconnect:
        notifier.remove(websocket)

@app.post("/push/")
async def push_to_connected_websockets(messages: MessageList):
    await notifier.push(messages)

@app.on_event("startup")
async def startup():
    # Prime the push notification generator
    await notifier.generator.asend(None)