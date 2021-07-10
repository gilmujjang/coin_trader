import request from 'request';

export default async function candle_price(coin, intervals, length){
  const api_url = "https://api.bithumb.com/public/candlestick/"+coin+"_KRW/"+intervals;
  const candle = []
  const response = new Promise((resolve, reject) => {
    request({
      uri:api_url,
    },(err, res, result) => {
      if (err) reject(error);
      if (res.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(JSON.parse(result));
      }
    )
  })
  const response_json = await response;
  const n = response_json["data"].length-1
  for(let i=0; i<length; i++){
    candle.push(Number(response_json["data"][n-i][2]))
  }

  return candle
}
