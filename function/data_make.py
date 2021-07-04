import json
import os
from datetime import datetime
import time


filename = './etc/btc_candle.json'

with open(filename, 'r+', encoding='utf-8') as f:
    json_data = json.load(f)
    for date in json_data:
        d = str(date["time"])[0:10]
        newTimeString = datetime.utcfromtimestamp(
            int(d)).strftime('20%y-%m-%d')
        date["time"] = newTimeString
        print(newTimeString)

os.remove(filename)

with open(filename, 'w') as f:
    json.dump(json_data, f, indent=2)
