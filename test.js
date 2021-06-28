import mybalance from './mybalance.js'
import search from './search.js'

// mybalance()
// search("BTC")
let count = 0;

const loop = setInterval(async function() {
  const coin_price = await search("ETH");
  console.log(coin_price)

  count ++
  if(count === 3){
    clearInterval(loop)
  }
},1000)