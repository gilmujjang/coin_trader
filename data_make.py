import json
import os
from datetime import datetime


filename = './data.json'

with open(filename, 'r+', encoding='utf-8') as f:
    json_data = json.load(f)["values"]
    for date in json_data:
        d = date["x"]
        newTimeString = datetime.utcfromtimestamp(
            d).strftime('20%y-%m-%d')
        date["x"] = newTimeString

os.remove(filename)

with open(filename, 'w') as f:
    json.dump(json_data, f, indent=2)
