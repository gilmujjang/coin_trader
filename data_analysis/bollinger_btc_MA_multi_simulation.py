from mpl_finance import candlestick2_ohlc
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import json
import sys
import io
import numpy as np

MA = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
      17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
result = []


SD = 2

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')
plt.rc('font', family='Malgun Gothic')

# filename = './etc/btc_candle_sideway_2013.json'
# filename = './etc/btc_candle_sideway_2018.json'
filename = './etc/btc_candle_all.json'

df = pd.read_json(filename)
fig, ax = plt.subplots(figsize=(10, 10))
day_list = []
name_list = []

date = []
price = []
bollinger_center = []
bollinger_top = []
bollinger_bottom = []
recent_days_list = []
recent_days_standard_deviation = []


with open(filename, 'r', encoding='utf-8') as f:
    json_data = json.load(f)
    for i in range(len(MA)):
        recent_days_list.append([int(json_data[0]['close'])
                                for j in range(MA[i])])
        bollinger_center.append([])
        recent_days_standard_deviation.append([])
        bollinger_top.append([])
        bollinger_bottom.append([])

    for d in range(len(json_data)):
        date.append(json_data[d]['time'])
        price.append(int(json_data[d]['close']))

        for i in range(len(MA)):
            for j in reversed(range(MA[i])):
                recent_days_list[i][j] = recent_days_list[i][j-1]
            recent_days_list[i][0] = int(json_data[d]['close'])

            bollinger_center[i].append(
                round(np.mean(recent_days_list[i]), 2))
            recent_days_standard_deviation[i].append(
                round(np.std(recent_days_list[i]), 2))

            bollinger_top[i].append(
                bollinger_center[i][d]+round(np.std(recent_days_list[i]), 2)*SD)
            bollinger_bottom[i].append(
                bollinger_center[i][d]-round(np.std(recent_days_list[i]), 2)*SD)


# 백테스팅

for i in range(len(MA)):
    seed = 1000000
    relative_price = []
    btc_state = False  # btc보유상태
    btc_hold = 0  # btc보유량
    btc_hold_price = 0  # 구매당시 가격
    income = 0
    income_list = []  # 투자결과 리스트
    high = 0  # 고점
    krw = 1000000  # 백만원
    trade = 0  # 트레이딩 횟수
    trade_qunatity = 1  # 총 자산의 일정 % 만 투자

    print("-----------------------")
    print(MA[i])
    for j in range(len(date)):
        if(btc_state == True and high < price[j]):  # 고가 갱신
            high = price[j]

        if(price[j] >= bollinger_top[i][j] and btc_state == False):
            high = price[j]
            btc_hold = round((krw*trade_qunatity)/price[j], 4)
            btc_hold_price = int(price[j])
            krw = krw - int(btc_hold*price[j])
            btc_state = True
            print(date[j], " : ", "매수 ", price[j])

        if(price[j] <= high*0.9 and btc_state == True):
            income = income + (int(price[j])-btc_hold_price)*btc_hold
            krw = krw + int(btc_hold*price[j])
            btc_hold = 0
            btc_hold_price = 0
            trade = trade + 1
            high = 0
            btc_state = False
            print(date[j], " : ", "매도 ", price[j])

    if(btc_hold != 0):
        income = income + (int(price[len(date)-1])-btc_hold_price)*btc_hold
        krw = krw + int(btc_hold*price[len(date)-1])
        btc_hold = 0
        btc_hold_price = 0
        trade = trade + 1
        high = 0
        btc_state = False

    print(income/seed)
    result.append(round((income/seed)+1, 2))

plt.plot(MA, result)
ax.set_title(
    'BTC-볼린저 상단 매수 고가 -10% 매도, 표준편차 2배 비교, 총 자산의 100%투자, 2013~2021 전체기간, 이동평균선 에 따른 수익률 비교', fontsize=22)
ax.set_ylabel('수익률 (배)')
ax.set_xlabel('이동평균 기준일')

plt.show()
