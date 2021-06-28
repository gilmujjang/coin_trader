import request from 'request';

const api_base = 'https://api.bithumb.com';

export default async function search(coin){
  let req_query = {
    endpoint:"/public/orderbook/"+coin+"_KRW"
  }
  return new Promise((resolve, reject) => {
    request({
      uri:api_base+req_query['endpoint'],
    },(err, res, result) => {
      if (err) reject(error);
      if (res.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(JSON.parse(result).data.bids[0].price);
      }
    )
  })
}