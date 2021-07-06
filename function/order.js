import request from 'request';
import { make_header } from './api_function.js';

export default async function order(order_id){
  let req_query = {
    endpoint:"/info/order_detail",
    order_currency:"BTC",
    order_id: order_id
  }
  const response = new Promise((resolve, reject) => {
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
      resolve(JSON.parse(result).data);
      }
    )
  })
  const response_json = await response;
  console.log(response_json)
}

order()

