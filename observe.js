import request from 'request';


let a = 0;
let i = 0;

request({
  uri:"https://api.bithumb.com/public/orderbook/",
}, (err, res, result) => {
  if(err){
    console.log(err)
    console.log("에러남")
    return
  }
  a = JSON.parse(result).data.bids[0].price
  i = a
  }
)

setInterval(() => {
  request({
    uri:"https://api.bithumb.com/public/orderbook/",
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    i=JSON.parse(result).data.bids[0].price
    }
  )
  console.log(i-a)
  a = i
},3000)