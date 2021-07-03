import mybalance from './mybalance.js'
import search from './search.js'
import candle_data from './candle_data.js'

// mybalance()
// search("BTC")

// candle data
async function test(){
  const candle = await candle_data("BTC","24h",3)
  console.log(candle)
}
test()

let count = 0;

let btc_list = new Array(3)

async function init_function(){
  const coin_price_init = await search("BTC");
  btc_list.fill(coin_price_init)
}

init_function();


const loop = setInterval(async function() {
  const coin_price = await search("BTC");
  for (let i=btc_list.length-1; i>0; i--){
    btc_list[i]= btc_list[i-1];
  }
  btc_list[0] = coin_price;
  console.log(btc_list);

  count ++
  if(count === 5){
    clearInterval(loop);
  }
},1000)