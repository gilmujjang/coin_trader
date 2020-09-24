import request from 'request'
import { make_header } from './api_function.js';


const api_base = 'https://api.bithumb.com';
let req_query = {
	endpoint:'/trade/market_sell',
	units:'0.0001',
  order_currency:"BTC",
	payment_currency:"KRW",
}

function market_sell(req_query){
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
    console.log(JSON.parse(result))
  })
}

req_query = {
	endpoint:'/trade/market_buy',
	units:'0.0001',
  order_currency:"BTC",
	payment_currency:"KRW",
}

// market_sell(req_query)