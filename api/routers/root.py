from fastapi import WebSocket, APIRouter, Depends
from starlette.websockets import WebSocketDisconnect
from api.models.message import MessageList
from api.managers.message import get_message_manager, MessageManager
from api.config.settings import get_settings, Settings
import logging

router = APIRouter()

logger = logging.getLogger("api")

@router.websocket("/backend/ws")
async def websocket_endpoint(websocket: WebSocket, notifier: MessageManager = Depends(get_message_manager)):
    await notifier.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if data: 
                logger.debug(f"Received data: {data}")
                await notifier.push(MessageList.parse_obj(data)) 
    except WebSocketDisconnect:
        notifier.remove(websocket)

@router.post("/backend/push/")
async def push_to_connected_websockets(messages: MessageList, notifier: MessageManager = Depends(get_message_manager)):
    await notifier.push(messages)
