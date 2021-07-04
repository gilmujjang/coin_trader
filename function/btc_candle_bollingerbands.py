from mpl_finance import candlestick2_ohlc
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import json
import sys
import io
import numpy as np

MA = 20
SD = 2

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')
plt.rc('font', family='Malgun Gothic')

filename = './etc/btc_candle_all.json'

df = pd.read_json(filename)
fig, ax = plt.subplots(figsize=(10, 5))
day_list = []
name_list = []

date = []
price = []
ten_days_center = []
ten_days_bottom = []
ten_days_up = []

with open(filename, 'r', encoding='utf-8') as f:
    json_data = json.load(f)
    recent_ten_days_list = [int(json_data[0]['close']) for i in range(MA)]
    for d in json_data:
        date.append(d['time'])
        price.append(int(d['close']))

        # 최근 10일간 가격 데이터 수집
        for i in reversed(range(MA)):
            recent_ten_days_list[i] = recent_ten_days_list[i-1]
        recent_ten_days_list[0] = int(d['close'])

        # 최근 10일간 평균 구함
        ten_days_average = round(np.mean(recent_ten_days_list), 2)
        ten_days_center.append(ten_days_average)

        # 최근 10일간 표준편차
        ten_days_standard_deviation = round(np.std(recent_ten_days_list), 2)

        ten_days_up.append(ten_days_average+ten_days_standard_deviation*SD)
        ten_days_bottom.append(ten_days_average-ten_days_standard_deviation*SD)

plt.plot(date, price, date, ten_days_center,
         date, ten_days_up, date, ten_days_bottom)
# 그래프 title과 축 이름 지정
ax.set_title('BTC Candle Chart', fontsize=22)
ax.set_ylabel('BTC price')
ax.set_xlabel('Date')

for i, day in enumerate(df['time']):
    if i % 100 == 0:
        day_list.append(i)
        name_list.append(day)

# 캔들차트 그리기
ax.xaxis.set_major_locator(ticker.FixedLocator(day_list))
ax.xaxis.set_major_formatter(ticker.FixedFormatter(name_list))
candlestick2_ohlc(ax, df['open'], df['high'],
                  df['low'], df['close'],
                  width=0.5, colorup='r', colordown='b')
ax.legend(['Candle'])

plt.grid()
plt.show()
