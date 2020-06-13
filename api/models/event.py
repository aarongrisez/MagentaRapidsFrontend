from typing import List
from .note import SynthesizedNote
from pydantic import BaseModel

class SynthesizedEvent(BaseModel):
    channel: int
    notes: List[SynthesizedNote]
