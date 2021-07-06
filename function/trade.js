import request from 'request';
import { make_header } from './api_function.js';
import { dbService } from './fbase.js';
import moment from 'moment'

export default function trade(SoB, coin, howmuch){
  let req_query = {
    endpoint:'/trade/market_'+SoB,
    units:howmuch,
    order_currency:coin,
    payment_currency:"KRW",
  }
  request({
    method:'POST',
    uri:'https://api.bithumb.com'+req_query['endpoint'],
    headers: make_header(req_query),
    formData:req_query
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    if(JSON.parse(result).status == '0000'){
      let date = moment().format('YYYYMMDDHHmmss');

      const trade_obj = {
        time: date,
        SoB: SoB,
        coin: coin,
        howmuch: howmuch
      }
      saveinfo(trade_obj)
    } else {
      console.log("trading error")
      return
    }
  })
  
  function saveinfo(trade_obj){
    const time = String(trade_obj.time)
    console.log(time)
    dbService.collection("trade").doc(time).set(trade_obj)
    console.log(trade_obj)
  }

}
