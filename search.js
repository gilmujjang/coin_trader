import request from 'request';

const api_base = 'https://api.bithumb.com';

export function coinprice(coin){
  let req_query = {
    endpoint:"/public/orderbook/"+coin+"_KRW"
  }
  request({
    uri:api_base+req_query['endpoint'],
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    console.log(JSON.parse(result).data.bids[0].price)
    }
  )
}

coinprice("BTC")