import request from 'request';
import { trade } from './trade.js'

let last_price = 0;
let now_price = 0;
let fiveMA = 0;
let halfMA = 0;
let oneMA = 0;
let stoploss = 0;
let status = false;

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

    if(halfMA > fiveMA && oneMA>halfMA && status==false){
      console.log(halfMA +" --- "+fiveMA)
      console.log("매수")
      // trade("buy","BTC","0.001")
      status = true;
    }
    if(halfMA > oneMA && status==true){
      console.log(halfMA +" --- "+oneMA)
      console.log("매도")
      // trade("sell","BTC","0.001")
      status = false
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