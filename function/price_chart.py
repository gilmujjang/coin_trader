import matplotlib.pyplot as plt
import json
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')
plt.rc('font', family='Malgun Gothic')

filename = './etc/data.json'
date = []
price = []
ten_days_center = []

with open(filename, 'r', encoding='utf-8') as f:
    json_data = json.load(f)
    recent_ten_days_list = [json_data[0]['y'] for i in range(10)]
f.close()

with open(filename, 'r', encoding='utf-8') as f:
    json_data = json.load(f)
    for d in json_data:
        date.append(d['x'])
        price.append(d['y'])

        for i in reversed(range(10)):
            recent_ten_days_list[i] = recent_ten_days_list[i-1]

        recent_ten_days_list[0] = d['y']

        T_D_MA = 0
        for i in recent_ten_days_list:
            T_D_MA = T_D_MA+i
        ten_days_center.append(round(T_D_MA/10, 2))


plt.plot(date, price, date, ten_days_center)
plt.xticks([0, 200, 400, 600, 800, 1000])
plt.xlabel('date')
plt.ylabel('price (USD)')
plt.title('최근 3년간 비트코인 가격 변화')
plt.show()
