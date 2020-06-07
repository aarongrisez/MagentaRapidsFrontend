from fastapi import FastAPI, WebSocket
from typing import List, Union, Any, Callable
from functools import lru_cache
import logging
from api.models.message import Message, MessageList
from api.extensions.tracing import get_tracer
from aiocache import cached
from aiocache.serializers import PickleSerializer


logger = logging.getLogger("api")

class WebSocketConnectionManager:

    def __init__(self, connections: Union[List, None] = None):
        if connections:
            self.connections = connections
        else:
            self.connections = []
    
    def add_connection(self, connection: WebSocket) -> WebSocket:
        self.connections.append(connection)
        return connection
        
    def remove_connection(self, connection: WebSocket) -> WebSocket:
        self.connections.remove(connection)
        return connection
    
    async def apply_to_connections(self, function: Callable[...,Any]) -> None:
        living_connections = []
        while len(self.connections) > 0:
            # Looping like this is necessary in case a disconnection is handled
            # during await websocket.send_text(message)
            websocket = self.connections.pop()
            await function(websocket)
            living_connections.append(websocket)
        self.connections = living_connections

class MessageManager:

    def __init__(self):
        self.connections: List[WebSocket] = []
        self.generator = self.get_message_generator()
        self.connection_manager = get_websocket_connection_manager()

    async def get_message_generator(self):
        while True:
            message = yield
            await self._notify(message)
    
    async def push(self, msg: Message):
        with get_tracer().start_active_span("message_manager.push", finish_on_close=True) as scope:
            await self.generator.asend(msg)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connection_manager.add_connection(websocket)

    def remove(self, websocket: WebSocket):
        self.connection_manager.remove_connection(websocket)

    async def send(self, websocket: WebSocket, messages: MessageList):
        await websocket.send_text(messages.json())

    async def _notify(self, messages: MessageList):
        with get_tracer().start_active_span("message_manager._notify", finish_on_close=True) as scope:
            await self.connection_manager.apply_to_connections(
                lambda ws: self.send(ws, messages)
            )

@lru_cache()
def get_websocket_connection_manager():
    return WebSocketConnectionManager()

@cached()
async def get_message_manager():
    m = MessageManager()
    await m.generator.asend(None)
    return m