import search from './search.js'
import search_coins from './search_coins.js'
import balance from './balance.js'
import trade from './trade.js'


// mybalance()
// search("BTC")
// trade("sell","btc",0.0001)

let count = 0;

const btc_list = new Array(5);
const eth_list = new Array(5);
const lists_list = [btc_list, eth_list];
const target_coin_list = ["BTC", "ETH"];

async function init_function(){
  const my_coins = await balance(target_coin_list)
  console.log(my_coins)

  const init_coins_price = await search_coins(target_coin_list)
  for(let i=0; i< lists_list.length; i++){
    lists_list[i].fill(init_coins_price[i]);
  }
}

init_function();


const MainLoop = setInterval(async function() {
  const coins_price = await search_coins(target_coin_list);

  for(let i=0; i< lists_list.length; i++){
    for (let j=lists_list[i].length-1; j>0; j--){
      lists_list[i][j]= lists_list[i][j-1];
    }
  }

  for(let i=0; i< lists_list.length; i++){
    lists_list[i][0] = coins_price[i];
    console.log(lists_list[i])
  }

  count ++
  if(count === 5){
    clearInterval(MainLoop);
  }
},10000)