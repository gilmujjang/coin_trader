import request from 'request';

let max = 0;
function req(callback){
  request({
    uri:"https://api.bithumb.com/public/candlestick/",
}, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    let r = JSON.parse(result).data;
    let n = r.length-1;
    max = r[n][3]
    for(let i=0; i<10; i++){
      if(r[n-i][3]>max){
        max = r[n-i][3]
      }
    }
  })
  return max
}

function main(){
  req(function(err,max){
    console.log(max)
  })
}

main()