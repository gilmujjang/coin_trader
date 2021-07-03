import request from 'request'
import mongodb from 'mongodb';
import  cryptojsHmacSHA512 from 'crypto-js/hmac-sha512.js'
import apikey from './apikey.js'
const mongo = mongodb.MongoClient;

const api_base = 'https://api.bithumb.com';

function make_header(obj){
	let output_string = [];
  Object.keys(obj).forEach( (val) => {
    let key = val
    let value = encodeURIComponent(obj[val])
    output_string.push(key + '=' + value)
	})
	return API_Sign(output_string.join('&'),obj.endpoint)
	
	function API_Sign(str_q,endpoint){
		let nNonce = new Date().getTime()
    let spilter = String.fromCharCode(0)
		return {
      'Api-Key' : apikey.apiKey,
      'Api-Sign' : (base64_encode(cryptojsHmacSHA512(endpoint + spilter + str_q + spilter + nNonce, apikey.secretKey).toString())),
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

function trade(SoB, which, howmuch, nowprice){
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
    console.log(JSON.parse(result));
    if(JSON.parse(result).status == '0000'){
      saveinfo()
    }
  })
  

  // database 에 저장
  function saveinfo(){
    mongo.connect(apikey.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
      }, (err, client) => {
      if (err) {
        console.error(err)
        console.log("mongodb연결하다 error")
      }
      //...
      const db = client.db('trade-record')
      const collection = db.collection('record')
      collection.insertOne({what:SoB, which:which, units:howmuch, howmuch:howmuch*nowprice}, (err, result) => {
        if (err) {
          console.log(err)
          console.log("mongodb저장하다 error")
        }
        client.close()
      })
    })
  }

}

trade("sell","btc",0.0005,14000000)