import schedule
import time
import requests
from itertools import product
import random

CHANNELS = 2
CHANNEL_POLY = 2

def job():
    payload = [{
        "channel": 1,
        "note": [random.randrange(120, 2000) for i in range(CHANNEL_POLY)],
        "duration": "2n",
        "time": f"4n",
        "velocity": "1"
    } for i in range(3)]
    requests.post(f"http://api:8000/push/", json=payload)

schedule.every(0.5).seconds.do(job)

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(0.02)