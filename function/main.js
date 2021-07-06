import mybalance from './mybalance.js'
import search from './search.js'
import search_coins from './search_coins.js'
import balance from './balance.js'
import trade from './trade.js'




// mybalance()
// search("BTC")

// candle data

let count = 0;

let btc_list = new Array(5)
const target_coin_list = ["BTC", "ETH"]



async function init_function(){
  const coin_price_init = await search("BTC");
  btc_list.fill(coin_price_init)
  const my_coins = await balance(target_coin_list)
  console.log(my_coins)
  // const prices = await search_coins(target_coin_list)
  // console.log(prices)
}

init_function();


const MainLoop = setInterval(async function() {
  const coin_price = await search("BTC");
  for (let i=btc_list.length-1; i>0; i--){
    btc_list[i]= btc_list[i-1];
  }
  btc_list[0] = coin_price;
  console.log(btc_list);

  count ++
  if(count === 5){
    clearInterval(MainLoop);
  }
},1000)