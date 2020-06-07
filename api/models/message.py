from typing import List, Union
from pydantic import BaseModel
import uuid

class Message(BaseModel):
    channel: int
    note: Union[str, List]
    duration: str
    time: str
    velocity: str

class MessageList(BaseModel):
    __root__: List[Message]