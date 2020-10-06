import request from 'request';
function req(callback) {
  request('https://api.bithumb.com/public/orderbook/', function (error, response, body) {
    callback(body)
    }
  );
}

function a(b){
  console.log(b)
}

a(req())