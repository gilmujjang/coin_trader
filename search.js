import request from 'request';

request({
  method:'GET',
  uri: 'https://api.bithumb.com/public/orderbook',
  count:'30'
}, (err, res, result) => {
  if(err){
    console.log(err)
    console.log("에러남")
    return
  }
  console.log(JSON.parse(result).data.bids[0].price)
})
