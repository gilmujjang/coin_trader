import request from 'request';
import fs from 'fs';

export default async function candle_data(coin, intervals, length){
  const api_url = "https://api.bithumb.com/public/candlestick/"+coin+"_KRW/"+intervals;
  const candle = []
  const json_data = []
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
    candle.push(response_json["data"][n-i])
    const data_obj = {
      time: response_json["data"][n-i][0],
      start: response_json["data"][n-i][1],
      end: response_json["data"][n-i][2],
      high: response_json["data"][n-i][3],
      low: response_json["data"][n-i][4],
    }
    json_data.push(data_obj)
  }
  const json_file = JSON.stringify(json_data)
  fs.writeFileSync('btc_candle_data',json_file)

  return candle
}

candle_data("BTC","24h",2500)
