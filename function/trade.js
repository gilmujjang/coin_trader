import request from 'request';
import { make_header } from './api_function.js';
import { dbService } from './fbase.js';
import moment from 'moment'

export default async function trade(SoB, coin, howmuch){
  let req_query = {
    endpoint:'/trade/market_'+SoB,
    units:howmuch,
    order_currency:coin,
    payment_currency:"KRW",
  }
  const trade_order = new Promise((resolve, reject) => {
    request({
      method:'POST',
      uri:'https://api.bithumb.com'+req_query['endpoint'],
      headers: make_header(req_query),
      formData:req_query
      }, (err, res, result) => {
        if (err) reject(error);
        if (res.statusCode != 200) {
          reject('Invalid status code <' + response.statusCode + '>');
        }
        resolve(JSON.parse(result));
      }
    )
  })
  const trade_response = await trade_order
  if (trade_response.status == '0000'){
    const order_id = trade_response.order_id;

    const order_info = new Promise((resolve, reject) => {
      let req_query = {
        endpoint:"/info/order_detail",
        order_currency:coin,
        order_id: order_id
      }
      request({
        method:'POST',
        uri:'https://api.bithumb.com'+req_query['endpoint'],
        headers: make_header(req_query),
        formData:req_query
      }, (err, res, result) => {
        if (err) reject(error);
        if (res.statusCode != 200) {
          reject('Invalid status code <' + response.statusCode + '>');
        }
        resolve(JSON.parse(result));
        }
      )
    })
    let order_info_response = await order_info

    while(order_info_response.data.order_status != 'Completed'){
      console.log(order_info_response.data.order_status)
      order_info_response = await order_info
    }
    console.log(order_info_response.data.contract)

    let date = moment().format('YYYYMMDDHHmmss');
    const trade_obj = {
      time: date,
      SoB: SoB,
      coin: coin,
      howmuch: howmuch
    }
    saveinfo(trade_obj)
    return
  } else {
    console.log(trade_response)
    console.log("trading error")
    return
  }
  
  function saveinfo(trade_obj){
    const time = String(trade_obj.time)
    console.log(time)
    dbService.collection("trade").doc(time).set(trade_obj)
    console.log("거래내역 저장완료")
  }
}

trade("buy","BTC", 0.0001)