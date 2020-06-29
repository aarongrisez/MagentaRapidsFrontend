import schedule
import functools
import time
import requests
import random
from models.event import SynthesizedEvent
from models.note import SynthesizedNote
import logging

CHANNELS = list(map(str, [1, 2, 3, 4, 5, 6]))
PITCHES = list(map(str, [120, 220, 320, 420, 520, 620, 720, 820]))
DURATIONS = list(map(str, [1, 2, 4]))
TIMES = list(map(str, [1, 2, 4, 8]))
VELOCITIES = list(map(str, [0.25, 0.5, 0.75, 1]))

def job(*args, **kwargs):
    note = SynthesizedNote(
        note = random.choice(PITCHES),
        duration = random.choice(DURATIONS),
        time = random.choice(TIMES),
        velocity = random.choice(VELOCITIES),
    )
    event = SynthesizedEvent(
        channel = random.choice(CHANNELS),
        notes = [note]
    )
    r = requests.post(f"http://api/backend/push/", json=event.dict())

schedule.every(2.87).seconds.do(lambda: job(1))
schedule.every(3.87).seconds.do(lambda: job(2))
schedule.every(4.87).seconds.do(lambda: job(3))
schedule.every(5.87).seconds.do(lambda: job(4))

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(0.02)