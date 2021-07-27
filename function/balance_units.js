import request from 'request';
import { make_header } from './api_function.js';

export default async function balance_units(coinlist){
  let req_query = {
    endpoint:"/info/balance",
    currency:"ALL"
  }
  const response = new Promise((resolve, reject) => {
    request({
      method:'POST',
      uri:'https://api.bithumb.com/info/balance',
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
  let coin_list = coinlist;
  const my_coins = await Promise.all(
    coin_list.map(async(coin) => {
      const lower_coin = coin.toLowerCase();
      const coin_worth = response_json["available_"+lower_coin]
      return Number(coin_worth)
    })
  )
  return my_coins
}
