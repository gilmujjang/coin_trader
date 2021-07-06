import request from 'request';


export default async function search_coins(coinlist){
  const prices = await Promise.all(
    coinlist.map(async(coin) => {
      const response = new Promise((resolve, reject) => {
        request({
          uri: "https://api.bithumb.com/public/orderbook/"+coin+"_KRW",
        }, (err, res, result) => {
          if (err) reject(error);
          if (res.statusCode != 200) {
            reject('Invalid status code <' + response.statusCode + '>');
          }
          resolve(JSON.parse(result).data.bids[0].price);
          }
        )
      })
      const response_json = await response;
      return Number(response_json)
    })
  )
  return prices
}