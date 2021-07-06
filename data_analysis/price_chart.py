
# 비트코인 최근 3년간 가격에 표준편차 2배 한 볼린저밴드

import matplotlib.pyplot as plt
import json
import sys
import io
import numpy as np

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')
plt.rc('font', family='Malgun Gothic')

filename = './etc/data.json'
date = []
price = []
ten_days_center = []
ten_days_bottom = []
ten_days_up = []

with open(filename, 'r', encoding='utf-8') as f:
    json_data = json.load(f)
    recent_ten_days_list = [json_data[0]['y'] for i in range(10)]
f.close()

with open(filename, 'r', encoding='utf-8') as f:
    json_data = json.load(f)
    for d in json_data:
        date.append(d['x'])
        price.append(d['y'])

        # 최근 10일간 가격 데이터 수집
        for i in reversed(range(10)):
            recent_ten_days_list[i] = recent_ten_days_list[i-1]
        recent_ten_days_list[0] = d['y']

        # 최근 10일간 평균 구함
        ten_days_average = round(np.mean(recent_ten_days_list), 2)
        ten_days_center.append(ten_days_average)

        # 최근 10일간 표준편차
        ten_days_standard_deviation = round(np.std(recent_ten_days_list), 2)

        ten_days_up.append(ten_days_average+ten_days_standard_deviation*2)
        ten_days_bottom.append(ten_days_average-ten_days_standard_deviation*2)


plt.plot(date, price, date, ten_days_center,
         date, ten_days_up, date, ten_days_bottom)
plt.xticks([0, 200, 400, 600, 800, 1000])
plt.xlabel('date')
plt.ylabel('price (USD)')
plt.title('최근 3년간 비트코인의 볼린저 밴드 (표준편차2배)(최근 급상승 구간 제거)')
plt.show()
