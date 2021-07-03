import request from 'request';

request({
  uri:"https://api.bithumb.com/public/orderbook/",
}, (err, res, result) => {
  if(err){
    console.log(err)
    console.log("에러남")
    return
  }
  last_price = JSON.parse(result).data.bids[0].price
  now_price = last_price
  }
)

setInterval(() => {
  request({
    uri:"https://api.bithumb.com/public/candlestick/BTC_KRW/1h",
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    let n = JSON.parse(result).data.length-1;
    let container = 0;
    for(let i=0; i<24; i++){
      container = container + Number(JSON.parse(result).data[n-i][2])
    }
    oneMA = Math.round(container/24)
    container = 0;
    for(let i=0; i<60; i++){
      container = container + Number(JSON.parse(result).data[n-i][2])
    }
    halfMA = Math.round(container/60)
    container = 0;
    for(let i=0; i<120; i++){
      container = container + Number(JSON.parse(result).data[n-i][2])
    }
    fiveMA = Math.round(container/120)

    }
  )

},3000)