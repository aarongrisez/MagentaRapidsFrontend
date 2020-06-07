import schedule
import time
import requests
from itertools import product
import random

CHANNEL_POLY = 1

def job(channel):
    payload = [{
        "channel": f"{channel}",
        "note": [random.choice([120, 220, 320, 420, 520, 620, 720, 820]) for i in range(CHANNEL_POLY)],
        "duration": f"{random.choice([1,2,4])}n",
        "time": f"{random.choice([1,2,4,8])}n",
        "velocity": f"{random.random()}"
    }]
    requests.post(f"http://api/backend/push/", json=payload)

schedule.every(2.87).seconds.do(lambda: job(1))
schedule.every(3.87).seconds.do(lambda: job(2))
schedule.every(4.87).seconds.do(lambda: job(3))
schedule.every(5.87).seconds.do(lambda: job(4))

if __name__ == "__main__":
    while True:
        schedule.run_pending()
        time.sleep(0.02)