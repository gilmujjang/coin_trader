const cryptojsHmacSHA512 = require('crypto-js/hmac-sha512.js');
const apikey = require('./apikey.js').default;
const request = require('request');


const api_base = 'https://api.bithumb.com';

let btctendaymax = 0;
let ethtendaymax = 0;
let nowbtc = 0;
let noweth = 0;
let sellbtc = 0;
let selleth = 0;
let btcstatus = false;
let ethstatus = false;
let cash =0;
let btc = 0;
let eth =0;
let total = 0;

let req_query = {
  endpoint:"/info/balance",
  currency:"ALL"
}

function make_header(obj){
	let output_string = [];
  Object.keys(obj).forEach( (val) => {
    let key = val
		let value = encodeURIComponent(obj[val].replace(/[!'()*]/g, escape))
    output_string.push(key + '=' + value)
	})
	return API_Sign(output_string.join('&'),obj.endpoint)
	
	function API_Sign(str_q,endpoint){
		const api_private_info = apikey.default;
		let nNonce = new Date().getTime()
		let spilter = String.fromCharCode(0)
		return {
			'Api-Key' : api_private_info.apiKey,
			'Api-Sign' : (base64_encode(cryptojsHmacSHA512(endpoint + spilter + str_q + spilter + nNonce, api_private_info.secretKey).toString())),
			'Api-Nonce' : nNonce
		};
	}

	function base64_encode(data) {
		var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
		var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		enc = '',
		tmp_arr = [];
	
		if (!data) {
			return data;
		}
		do { // pack three octets into four hexets
			o1 = data.charCodeAt(i++);
			o2 = data.charCodeAt(i++);
			o3 = data.charCodeAt(i++);
			bits = o1 << 16 | o2 << 8 | o3;
			h1 = bits >> 18 & 0x3f;
			h2 = bits >> 12 & 0x3f;
			h3 = bits >> 6 & 0x3f;
			h4 = bits & 0x3f;
			tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
		} while (i < data.length);
		enc = tmp_arr.join('');
		var r = data.length % 3;
		return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
	}

}

///trade function
function trade(SoB, which, howmuch){
  let req_query = {
    endpoint:'/trade/market_'+SoB,
    units:howmuch,
    order_currency:which,
    payment_currency:"KRW",
  }
  request({
    method:'POST',
    uri:api_base+req_query['endpoint'],
    headers: make_header(req_query),
    formData:req_query
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    console.log(JSON.parse(result))
  })
}

setInterval(() => {
  //데이터 갱신하는부분
  //비트코인 오늘 이전 10일 고가,손절가
  request({
    uri:"https://api.bithumb.com/public/candlestick/BTC_KRW",
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    let r = JSON.parse(result).data;
    let n = r.length-2;
    btctendaymax = r[n][3]
    for(let i=0; i<10; i++){
        if(r[n-i][3]>btctendaymax){
          btctendaymax = r[n-i][3]
        }
    }
    //10일고가에서 5%하락시 손절
    sellbtc = btctendaymax*0.95;
  }
  )
  //이더리움 오늘 이전 10일 고가,손절가
  request({
    uri:"https://api.bithumb.com/public/candlestick/ETH_KRW",
    }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    let r = JSON.parse(result).data;
    let n = r.length-2;
    ethtendaymax = r[n][3]
    for(let i=0; i<10; i++){
        if(r[n-i][3]>ethtendaymax){
          ethtendaymax = r[n-i][3]
        }
    }
    //10일고가에서 5%하락시 손절
    selleth = ethtendaymax*0.95;
  }
  )
  //비트코인 현재가
  request({
    uri:"https://api.bithumb.com/public/orderbook/BTC_KRW",
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    nowbtc = JSON.parse(result).data.bids[0].price
  })
  //이더리움 현재가
  request({
    uri:"https://api.bithumb.com/public/orderbook/ETH_KRW",
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    noweth = JSON.parse(result).data.bids[0].price
  })
  //1초후에 내 자산 조회
  setTimeout(() => {
    request({
      method:'POST',
      uri:api_base+req_query['endpoint'],
      headers: make_header(req_query),
      formData:req_query
    }, (err, res, result) => {
      if(err){
        console.log(err)
        console.log("에러남")
        return
      }
      cash = Number(JSON.parse(result).data.total_krw);
      btc = Number(JSON.parse(result).data.total_btc);
      eth = Number(JSON.parse(result).data.total_eth);
      total = cash + btc*nowbtc + eth*noweth;
    })
  },1000)

  //2초후에 시스템 작동
  setTimeout(function(){
    //비트코인 보유
    if(btcstatus == true){
      //손절조건 충족
      if(sellbtc>nowbtc){
        trade("sell","btc",btc)
        btcstatus = false;
        console.log("비트코인 매도" + btc*nowbtc)
      }
    }
    //비트코인 없음
    if(btcstatus == false){
      if(nowbtc>btctendaymax){
        trade("buy","btc",nowbtc/(total*0.3))
        btcstatus = true;
        console.log("비트코인 매수" + nowbtc/(total*0.3))
      }
    }

    //이더리움 보유
    if(ethstatus == true){
      //손절조건 충족
      if(selleth>noweth){
        trade("sell","eth",eth)
        ethstatus = false;
        console.log("이더리움 매도" + eth*noweth)
      }
    }
    //이더리움 없음
    if(ethstatus == false){
      if(noweth>ethtendaymax){
        trade("buy","eth",noweth/(total*0.3))
        ethstatus = true;
        console.log("이더리움 매수" + noweth/(total*0.3))
      }
    }

  },2000)

},10000)