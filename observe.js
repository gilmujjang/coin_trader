import request from 'request';


let last_price = 0;
let now_price = 0;
let fourtyMA = 100000000;
let twentyMA = 0;

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
    let shortAM = 0;
    let longAM = 0;
    let container = 0;
    for(let i=0; i<12; i++){
      container = container + Number(JSON.parse(result).data[n-i][2])
    }
    shortAM = Math.round(container/12)
    container = 0;
    for(let i=0; i<60; i++){
      container = container + Number(JSON.parse(result).data[n-i][2])
    }
    longAM = Math.round(container/60)
    if(lognAM<shortAM){

    }
    }
  )
  // request({
  //   uri:"https://api.bithumb.com/public/orderbook/",
  // }, (err, res, result) => {
  //   if(err){
  //     console.log(err)
  //     console.log("에러남")
  //     return
  //   }
  //   now_price=JSON.parse(result).data.bids[0].price
  //   }
  // )
  // last_price = now_price
},3000)