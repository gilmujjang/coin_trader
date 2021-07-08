import search_coins from './search_coins.js'
import balance from './balance.js'
import trade from './trade.js'


// mybalance()
// search("BTC")
// trade("sell","btc",0.0001)

let count = 0;

const btc_list = new Array(10);
const eth_list = new Array(10);
const bnb_list = new Array(10);


const lists_list = [btc_list, eth_list,bnb_list];
const target_coin_list = ["BTC", "ETH","BNB"];

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
    lists_list[i][0] = coins_price[i];
    if(coins_price[i] > lists_list[i][1]){
      console.log(target_coin_list[i],lists_list[i][1],"->",coins_price[i],"👍")
    }
    if(coins_price[i] < lists_list[i][1]){
      console.log(target_coin_list[i],lists_list[i][1],"->",coins_price[i],"👎")
    }
  }

  count ++
  if(count === 3){
    clearInterval(MainLoop);
  }
},10000)