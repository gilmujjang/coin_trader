import  cryptojsHmacSHA512 from 'crypto-js/hmac-sha512.js'
import * as apikey from './apikey.js'



export function make_header(obj){
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
