import request from 'request'
import { make_header } from './api_function.js';


const api_base = 'https://api.bithumb.com';

export function trade(SoB, which, howmuch){
  let req_query = {
    endpoint:'/trade/market_'+SoB,
    units:howmuch,
    order_currency:which,
    payment_currency:"KRW",
  }
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