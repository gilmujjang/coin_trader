import request from 'request';
import { make_header } from './api_function.js';

const api_base = 'https://api.bithumb.com';

export function coinprice(coin){
  let req_query = {
    endpoint:"/public/orderbook/"+coin+"_KRW"
  }
  request({
    method:'GET',
    uri:api_base+req_query['endpoint'],
    headers: make_header(req_query),
    formData:req_query
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    console.log(JSON.parse(result).data.bids[0].price)
  })
}