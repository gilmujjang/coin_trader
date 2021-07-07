from mpl_finance import candlestick2_ohlc
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import json
import sys
import io
import numpy as np

MA_1 = 8
MA_2 = 9
MA_3 = 10
MA_4 = 11


SD = 2

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

bollinger_center_2 = []
bollinger_bottom_2 = []
bollinger_up_2 = []

bollinger_center_3 = []
bollinger_bottom_3 = []
bollinger_up_3 = []

bollinger_center_4 = []
bollinger_bottom_4 = []
bollinger_up_4 = []

with open(filename, 'r', encoding='utf-8') as f:
    json_data = json.load(f)
    recent_days_list_1 = [int(json_data[0]['close']) for i in range(MA_1)]
    recent_days_list_2 = [int(json_data[0]['close']) for i in range(MA_2)]
    recent_days_list_3 = [int(json_data[0]['close']) for i in range(MA_3)]
    recent_days_list_4 = [int(json_data[0]['close']) for i in range(MA_4)]

    for d in json_data:
        date.append(d['time'])
        price.append(int(d['close']))

        # 최근 10일간 가격 데이터 수집
        for i in reversed(range(MA_1)):
            recent_days_list_1[i] = recent_days_list_1[i-1]
        recent_days_list_1[0] = int(d['close'])

        for i in reversed(range(MA_2)):
            recent_days_list_2[i] = recent_days_list_2[i-1]
        recent_days_list_2[0] = int(d['close'])

        for i in reversed(range(MA_3)):
            recent_days_list_3[i] = recent_days_list_3[i-1]
        recent_days_list_3[0] = int(d['close'])

        for i in reversed(range(MA_4)):
            recent_days_list_4[i] = recent_days_list_4[i-1]
        recent_days_list_4[0] = int(d['close'])

        # 최근 10일간 평균 구함
        ten_days_average_1 = round(np.mean(recent_days_list_1), 2)
        ten_days_average_2 = round(np.mean(recent_days_list_2), 2)
        ten_days_average_3 = round(np.mean(recent_days_list_3), 2)
        ten_days_average_4 = round(np.mean(recent_days_list_4), 2)

        bollinger_center_1.append(ten_days_average_1)
        bollinger_center_2.append(ten_days_average_2)
        bollinger_center_3.append(ten_days_average_3)
        bollinger_center_4.append(ten_days_average_4)

        # 최근 10일간 표준편차
        ten_days_standard_deviation_1 = round(np.std(recent_days_list_1), 2)
        ten_days_standard_deviation_2 = round(np.std(recent_days_list_2), 2)
        ten_days_standard_deviation_3 = round(np.std(recent_days_list_3), 2)
        ten_days_standard_deviation_4 = round(np.std(recent_days_list_4), 2)

        bollinger_up_1.append(
            ten_days_average_1+ten_days_standard_deviation_1*SD)
        bollinger_bottom_1.append(
            ten_days_average_1-ten_days_standard_deviation_1*SD)
        bollinger_up_2.append(
            ten_days_average_2+ten_days_standard_deviation_2*SD)
        bollinger_bottom_2.append(
            ten_days_average_2-ten_days_standard_deviation_2*SD)
        bollinger_up_3.append(
            ten_days_average_3+ten_days_standard_deviation_3*SD)
        bollinger_bottom_3.append(
            ten_days_average_3-ten_days_standard_deviation_3*SD)
        bollinger_up_4.append(
            ten_days_average_4+ten_days_standard_deviation_4*SD)
        bollinger_bottom_4.append(
            ten_days_average_4-ten_days_standard_deviation_4*SD)


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
# 두번째
btc_state_2 = False  # btc보유상태
btc_hold_2 = 0  # btc보유량
btc_hold_price_2 = 0  # 구매당시 가격
income_2 = 0
income_list_2 = []  # 투자결과 리스트
high_2 = 0  # 고점
krw_2 = 1000000  # 백만원
trade_2 = 0  # 트레이딩 횟수
trade_qunatity_2 = 1  # 총 자산의 일정 % 만 투자
return_rate_2 = []
# 세번째
btc_state_3 = False  # btc보유상태
btc_hold_3 = 0  # btc보유량
btc_hold_price_3 = 0  # 구매당시 가격
income_3 = 0
income_list_3 = []  # 투자결과 리스트
high_3 = 0  # 고점
krw_3 = 1000000  # 백만원
trade_3 = 0  # 트레이딩 횟수
trade_qunatity_3 = 1  # 총 자산의 일정 % 만 투자
return_rate_3 = []
# 네번째
btc_state_4 = False  # btc보유상태
btc_hold_4 = 0  # btc보유량
btc_hold_price_4 = 0  # 구매당시 가격
income_4 = 0
income_list_4 = []  # 투자결과 리스트
high_4 = 0  # 고점
krw_4 = 1000000  # 백만원
trade_4 = 0  # 트레이딩 횟수
trade_qunatity_4 = 1  # 총 자산의 일정 % 만 투자
return_rate_4 = []

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


# 두번째
for i in range(len(date)):
    if(btc_state_2 == True and high_2 < price[i]):  # 고가 갱신
        high_2 = price[i]

    if(price[i] >= bollinger_up_2[i] and btc_state_2 == False):
        high_2 = price[i]
        btc_hold_2 = round((krw_2*trade_qunatity_2)/price[i], 4)
        btc_hold_price_2 = int(price[i])
        krw_2 = krw_2 - int(btc_hold_2*price[i])
        btc_state_2 = True

    if(price[i] <= high_2*0.9 and btc_state_2 == True):
        income_2 = income_2 + (int(price[i])-btc_hold_price_2)*btc_hold_2
        krw_2 = krw_2 + int(btc_hold_2*price[i])
        btc_hold_2 = 0
        btc_hold_price_2 = 0
        total_fee = total_fee + fee
        trade_2 = trade_2 + 1
        high_2 = 0
        btc_state_2 = False
        # print(date[i], " : ", "매도 ", price[i])

    income_list_2.append(int(income_2))
    return_rate_2.append((income_2/seed)+1)

# 두번째보유코인 정리
if(btc_hold_2 != 0):
    income_2 = income_2 + (int(price[i])-btc_hold_price_2)*btc_hold_2
    krw_2 = krw_2 + int(btc_hold_2*price[i])
    btc_hold_2 = 0
    btc_hold_price_2 = 0
    total_fee = total_fee + fee
    trade_2 = trade_2 + 1
    high_2 = 0
    btc_state_2 = False

# 세번째
for i in range(len(date)):
    if(btc_state_3 == True and high_3 < price[i]):  # 고가 갱신
        high_3 = price[i]

    if(price[i] >= bollinger_up_3[i] and btc_state_3 == False):
        high_3 = price[i]
        btc_hold_3 = round((krw_3*trade_qunatity_3)/price[i], 4)
        btc_hold_price_3 = int(price[i])
        krw_3 = krw_3 - int(btc_hold_3*price[i])
        btc_state_3 = True

    if(price[i] <= high_3*0.9 and btc_state_3 == True):
        income_3 = income_3 + (int(price[i])-btc_hold_price_3)*btc_hold_3
        krw_3 = krw_3 + int(btc_hold_3*price[i])
        btc_hold_3 = 0
        btc_hold_price_3 = 0
        total_fee = total_fee + fee
        trade_3 = trade_3 + 1
        high_3 = 0
        btc_state_3 = False
        # print(date[i], " : ", "매도 ", price[i])

    income_list_3.append(int(income_3))
    return_rate_3.append((income_3/seed)+1)

# 세번째보유코인 정리
if(btc_hold_3 != 0):
    income_3 = income_3 + (int(price[i])-btc_hold_price_3)*btc_hold_3
    krw_3 = krw_3 + int(btc_hold_3*price[i])
    btc_hold_3 = 0
    btc_hold_price_3 = 0
    total_fee = total_fee + fee
    trade_3 = trade_3 + 1
    high_3 = 0
    btc_state_3 = False

# 네번째
for i in range(len(date)):
    if(btc_state_4 == True and high_4 < price[i]):  # 고가 갱신
        high_4 = price[i]

    if(price[i] >= bollinger_up_4[i] and btc_state_4 == False):
        high_4 = price[i]
        btc_hold_4 = round((krw_4*trade_qunatity_4)/price[i], 4)
        btc_hold_price_4 = int(price[i])
        krw_4 = krw_4 - int(btc_hold_4*price[i])
        btc_state_4 = True

    if(price[i] <= high_4*0.9 and btc_state_4 == True):
        income_4 = income_4 + (int(price[i])-btc_hold_price_4)*btc_hold_4
        krw_4 = krw_4 + int(btc_hold_4*price[i])
        btc_hold_4 = 0
        btc_hold_price_4 = 0
        total_fee = total_fee + fee
        trade_4 = trade_4 + 1
        high_4 = 0
        btc_state_4 = False
        # print(date[i], " : ", "매도 ", price[i])

    income_list_4.append(int(income_4))
    return_rate_4.append((income_4/seed)+1)

# 네번째보유코인 정리
if(btc_hold_4 != 0):
    income_4 = income_4 + (int(price[i])-btc_hold_price_4)*btc_hold_4
    krw_4 = krw_4 + int(btc_hold_4*price[i])
    btc_hold_4 = 0
    btc_hold_price_4 = 0
    total_fee = total_fee + fee
    trade_4 = trade_3 + 1
    high_4 = 0
    btc_state_4 = False

day_list = []
name_list = []

for i, day in enumerate(df['time']):
    if i % 200 == 0:
        day_list.append(i)
        name_list.append(day)

ax.set_title(
    'BTC-볼린저 상단 매수 고가 -10% 매도, 이동평균선 19일,20일,21일,22일 표준편차 2배 비교, 총 자산의 100%투자, 2013~2021 전체기간', fontsize=22)
ax.set_ylabel('수익률 (배)')
ax.set_xlabel('Date')
ax.xaxis.set_major_locator(ticker.FixedLocator(day_list))
ax.xaxis.set_major_formatter(ticker.FixedFormatter(name_list))
plt.plot(date, return_rate_1, date, return_rate_2,
         date, return_rate_3, date, return_rate_4)
plt.plot(date, relative_price, color='r')
plt.legend(['MA 8일', 'MA 9일', 'MA 10일', 'MA 11일', '보유 수익률'])
plt.show()
