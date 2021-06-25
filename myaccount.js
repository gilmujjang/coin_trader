import request from 'request';
import { make_header } from './api_function.js';

const api_base = 'https://api.bithumb.com';
let cash = 0;
let btc =0;
let eth = 0;
let nowbtc = 0;
let noweth = 0;
let req_query = {
  endpoint:"/info/balance",
  currency:"ALL"
}

function myaccount(){
  request({
    uri:"https://api.bithumb.com/public/orderbook/BTC_KRW",
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    nowbtc = JSON.parse(result).data.bids[0].price
  })
  request({
    uri:"https://api.bithumb.com/public/orderbook/ETH_KRW",
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    noweth = JSON.parse(result).data.bids[0].price
  })
  setTimeout(function(){
    request({
      method:'POST',
      uri:api_base+req_query['endpoint'],
      headers: make_header(req_query),
      formData:req_query
    }, (err, res, result) => {
      if(err){
        console.log(err)
        console.log("에러남")
        return
      }
      cash = Number(JSON.parse(result).data.total_krw);
      btc = Number(JSON.parse(result).data.total_btc*nowbtc);
      eth = Number(JSON.parse(result).data.total_eth*noweth);
      console.log(" cash: "+cash+" btc: "+btc+" eth: "+eth)

    })
  },1000)
}

myaccount()
