import request from 'request';


export default async function search(coin){
  const api_url = "https://api.bithumb.com/public/orderbook/"+coin+"_KRW";
  const response = new Promise((resolve, reject) => {
    request({
      uri:api_url,
    },(err, res, result) => {
      if (err) reject(error);
      if (res.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(JSON.parse(result).data.bids[0].price);
      }
    )
  })
  const response_json = await response;

  return response_json
}