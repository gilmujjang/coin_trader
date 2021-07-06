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
    order_information(coin, order_id);
  } else {
    console.log(trade_response)
    console.log("trading error")
    return
  }
}

function order_information(coin, order_id){
  setTimeout(async() => {
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
    if(order_info_response.data.order_status != 'Completed'){
      console.log("체결에러");
      return
    }
    console.log(order_info_response.data)

    saveinfo(order_info_response.data)
    return
  }, 500);
}

function saveinfo(trade_obj){
  let time = moment().format('YYYYMMDDHHmmss');
  console.log(trade_obj)
  dbService.collection("trade").doc(time).set(trade_obj)
  console.log("거래내역 저장완료")
}

trade("buy","BTC", 0.0001)