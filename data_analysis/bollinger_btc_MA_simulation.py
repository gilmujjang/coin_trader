from mpl_finance import candlestick2_ohlc
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import json
import sys
import io
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

MA_1 = 20

SD = 1.5

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')
plt.rc('font', family='Malgun Gothic')

# filename = './etc/btc_candle_sideway_2013.json'
# filename = './etc/btc_candle_sideway_2018.json'
filename = './etc/btc_candle_all.json'

df = pd.read_json(filename)
fig, ax = plt.subplots(figsize=(10, 5))
day_list = []
name_list = []

date = []
price = []
bollinger_center_1 = []
bollinger_bottom_1 = []
bollinger_up_1 = []

with open(filename, 'r', encoding='utf-8') as f:
    json_data = json.load(f)
    recent_days_list_1 = [int(json_data[0]['close']) for i in range(MA_1)]

    for d in json_data:
        date.append(d['time'])
        price.append(int(d['close']))

        # 최근 10일간 가격 데이터 수집
        for i in reversed(range(MA_1)):
            recent_days_list_1[i] = recent_days_list_1[i-1]
        recent_days_list_1[0] = int(d['close'])

        # 최근 10일간 평균 구함
        ten_days_average_1 = round(np.mean(recent_days_list_1), 2)

        bollinger_center_1.append(ten_days_average_1)

        # 최근 10일간 표준편차
        ten_days_standard_deviation_1 = round(np.std(recent_days_list_1), 2)

        bollinger_up_1.append(
            ten_days_average_1+ten_days_standard_deviation_1*SD)
        bollinger_bottom_1.append(
            ten_days_average_1-ten_days_standard_deviation_1*SD)

# 백테스팅
# 공통변수
fee = 10
total_fee = 0
seed = 1000000
relative_price = []
# 첫번째
btc_state_1 = False  # btc보유상태
btc_hold_1 = 0  # btc보유량
btc_hold_price_1 = 0  # 구매당시 가격
income_1 = 0
income_list_1 = []  # 투자결과 리스트
high_1 = 0  # 고점
krw_1 = 1000000  # 백만원
trade_1 = 0  # 트레이딩 횟수
trade_qunatity_1 = 1  # 총 자산의 일정 % 만 투자
return_rate_1 = []


# 첫번째
for i in range(len(date)):
    relative_price.append(round(price[i]/price[0], 2))
    if(btc_state_1 == True and high_1 < price[i]):  # 고가 갱신
        high_1 = price[i]

    if(price[i] >= bollinger_up_1[i] and btc_state_1 == False):
        high_1 = price[i]
        btc_hold_1 = round((krw_1*trade_qunatity_1)/price[i], 4)
        btc_hold_price_1 = int(price[i])
        krw_1 = krw_1 - int(btc_hold_1*price[i])
        btc_state_1 = True

    if(price[i] <= high_1*0.9 and btc_state_1 == True):
        income_1 = income_1 + (int(price[i])-btc_hold_price_1)*btc_hold_1
        krw_1 = krw_1 + int(btc_hold_1*price[i])
        btc_hold_1 = 0
        btc_hold_price_1 = 0
        total_fee = total_fee + fee
        trade_1 = trade_1 + 1
        high_1 = 0
        btc_state_1 = False
        # print(date[i], " : ", "매도 ", price[i])

    income_list_1.append(int(income_1))
    return_rate_1.append((income_1/seed)+1)

# 첫번째보유코인 정리
if(btc_hold_1 != 0):
    income_1 = income_1 + (int(price[i])-btc_hold_price_1)*btc_hold_1
    krw_1 = krw_1 + int(btc_hold_1*price[i])
    btc_hold_1 = 0
    btc_hold_price_1 = 0
    total_fee = total_fee + fee
    trade_1 = trade_1 + 1
    high_1 = 0
    btc_state_1 = False

day_list = []
name_list = []

for i, day in enumerate(df['time']):
    if i % 100 == 0:
        day_list.append(i)
        name_list.append(day)

ax.set_title(
    'BTC-볼린저 상단 매수 고가 -10% 매도, 이동평균선 15일 표준편차 1.5배 비교 2018 하락기간', fontsize=22)
ax.set_ylabel('수익률 (배)')
ax.set_xlabel('Date')
ax.xaxis.set_major_locator(ticker.FixedLocator(day_list))
ax.xaxis.set_major_formatter(ticker.FixedFormatter(name_list))

plt.plot(date, return_rate_1)
plt.plot(date, relative_price, color='r')
plt.legend(['투자전략', 'BTC 단순 보유 수익률'])
plt.show()

print(trade_1)
