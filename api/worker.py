import schedule
import functools
import time
import requests
import random
from models.event import SynthesizedEvent
from models.note import SynthesizedNote

CHANNELS = list(map(str, [1, 2, 3, 4, 5, 6]))
PITCHES = list(map(str, [120, 220, 320, 420, 520, 620, 720, 820]))
DURATIONS = list(map(str, [1, 2, 4]))
TIMES = list(map(str, [1, 2, 4, 8]))
VELOCITIES = list(map(str, [0.25, 0.5, 0.75, 1]))

# This decorator can be applied to
def with_logging(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print('LOG: Runningjob "%s"' % func.__name__)
        result = func(*args, **kwargs)
        print('LOG: Job "%s" completed' % func.__name__)
        return result
    return wrapper

@with_logging
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
    r = requests.post(f"http://api/backend/push/", json=event.json())
    print(r.request.body)
    print(event.json())
    print(r.json())

schedule.every(2.87).seconds.do(lambda: job(1))
schedule.every(3.87).seconds.do(lambda: job(2))
schedule.every(4.87).seconds.do(lambda: job(3))
schedule.every(5.87).seconds.do(lambda: job(4))

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(0.02)