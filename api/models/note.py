from pydantic import BaseModel

class SynthesizedNote(BaseModel):
    note: str # Pitch
    duration: str
    time: str
    velocity: str
