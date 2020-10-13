import request from 'request';

request({
    uri:"https://api.bithumb.com/public/candlestick/",
}, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    let r = JSON.parse(result).data;
    let n = r.length-2;
    let max = r[n][3]
    for(let i=0; i<10; i++){
        if(r[n-i][3]>max){
            max = r[n-i][3]
        }
    }
    console.log(max)
    }
  )