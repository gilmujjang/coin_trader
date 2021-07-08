import matplotlib.pyplot as plt
import json
import sys
import io
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

MA = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
result = []

SD_list = [0.8,0.85, 0.9,0.95, 1.0,1.05, 1.1,1.15, 1.2,1.25, 1.3,1.35, 1.4,1.45, 1.5,1.55, 1.6,1.65, 1.7,1.75, 1.8,1.85, 1.9,1.95, 2]

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')
plt.rc('font', family='Malgun Gothic')

# filename = './etc/btc_candle_sideway_2013.json'
# filename = './etc/btc_candle_sideway_2018.json'
filename = './etc/btc_candle_all.json'

fig, ax = plt.subplots(figsize=(10, 10))

for SD in range(len(SD_list)):
    result.append([])
    with open(filename, 'r', encoding='utf-8') as f:
        json_data = json.load(f)
        date = []
        price = []
        bollinger_center = []
        bollinger_top = []
        bollinger_bottom = []
        recent_days_list = []
        recent_days_standard_deviation = []
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
                    bollinger_center[i][d]+round(np.std(recent_days_list[i]), 2)*SD_list[SD])
                bollinger_bottom[i].append(
                    bollinger_center[i][d]-round(np.std(recent_days_list[i]), 2)*SD_list[SD])

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

        for j in range(len(date)):
            if(btc_state == True and high < price[j]):  # 고가 갱신
                high = price[j]

            if(price[j] >= bollinger_top[i][j] and btc_state == False):
                high = price[j]
                btc_hold = round((krw*trade_qunatity)/price[j], 4)
                btc_hold_price = int(price[j])
                krw = krw - int(btc_hold*price[j])
                btc_state = True
                # print(date[j], " : ", "매수 ", price[j])

            if(price[j] <= high*0.9 and btc_state == True):
                income = income + (int(price[j])-btc_hold_price)*btc_hold
                krw = krw + int(btc_hold*price[j])
                btc_hold = 0
                btc_hold_price = 0
                trade = trade + 1
                high = 0
                btc_state = False
                # print(date[j], " : ", "매도 ", price[j])

        if(btc_hold != 0):
            income = income + (int(price[len(date)-1])-btc_hold_price)*btc_hold
            krw = krw + int(btc_hold*price[len(date)-1])
            btc_hold = 0
            btc_hold_price = 0
            trade = trade + 1
            high = 0
            btc_state = False

        result[SD].append(round((income/seed)+1, 2))

for i in range(len(result)):
    # plt.plot(MA, result[i])
    poly_features = PolynomialFeatures(degree=5, include_bias=False)
    MA_new = np.reshape(MA, (len(MA), 1))
    X_poly = poly_features.fit_transform(MA_new)
    lin_reg = LinearRegression()
    lin_reg.fit(X_poly, result[i])
    lin_reg.intercept_, lin_reg.coef_
    X_new_poly = poly_features.transform(MA_new)
    Y_new = lin_reg.predict(X_new_poly)
    plt.plot(MA, Y_new)
    plt.legend([SD_list[i]])
    plt.show()

# ax.set_title(
#     '2013~2021 전체기간 표준편차와 이동평균선 에 따른 수익률 비교, 5차항 회귀', fontsize=22)
# ax.set_ylabel('수익률 (배)', rotation=0)
# ax.set_xlabel('이동평균 기준일')
# plt.legend(['0.8배', '0.9배', '1배', '1.1배', '1.2배', '1.3배',
#            '1.4배', '1.5배', '1.6배', '1.7배', '1.8배', '1.9배', '2배'])
# plt.show()
