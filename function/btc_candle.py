from mpl_finance import candlestick2_ohlc
import matplotlib.ticker as ticker
import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_json('./etc/btc_candle.json')
fig = plt.figure(figsize=(20, 10))
ax = fig.add_subplot(111)
index = df.index.astype('str')  # 캔들스틱 x축이 str로 들어감

# X축 티커 숫자 20개로 제한
ax.xaxis.set_major_locator(ticker.MaxNLocator(20))

# 그래프 title과 축 이름 지정
ax.set_title('BTC Candle Chart', fontsize=22)
ax.set_xlabel('Date')

# 캔들차트 그리기
candlestick2_ohlc(ax, df['open'], df['high'],
                  df['low'], df['close'],
                  width=0.5, colorup='r', colordown='b')
ax.legend()
plt.grid()
plt.show()
