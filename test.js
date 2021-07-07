for i in range(len(date)):
    if(btc_state_5 == True and high_5 < price[i]):  # 고가 갱신
        high_5 = price[i]

    if(price[i] >= bollinger_up_5[i] and btc_state_5 == False):
        high_5 = price[i]
        btc_hold_5 = round((krw_5*trade_qunatity_5)/price[i], 5)
        btc_hold_price_5 = int(price[i])
        krw_5 = krw_5 - int(btc_hold_5*price[i])
        btc_state_5 = True

    if(price[i] <= high_5*0.9 and btc_state_5 == True):
        income_5 = income_5 + (int(price[i])-btc_hold_price_5)*btc_hold_5
        krw_5 = krw_5 + int(btc_hold_5*price[i])
        btc_hold_5 = 0
        btc_hold_price_5 = 0
        total_fee = total_fee + fee
        trade_5 = trade_5 + 1
        high_5 = 0
        btc_state_5 = False
        # print(date[i], " : ", "매도 ", price[i])

    income_list_5.append(int(income_5))
    return_rate_5.append((income_5/seed)+1)

# 네번째보유코인 정리
if(btc_hold_5 != 0):
    income_5 = income_5 + (int(price[i])-btc_hold_price_5)*btc_hold_5
    krw_5 = krw_5 + int(btc_hold_5*price[i])
    btc_hold_5 = 0
    btc_hold_price_5 = 0
    total_fee = total_fee + fee
    trade_5 = trade_3 + 1
    high_5 = 0
    btc_state_5 = False