import mybalance from './mybalance.js'
import search from './search.js'

// mybalance()
// search("BTC")
let count = 0;

const loop = setInterval(async function() {
  console.log("request")

  const result = await search("ETH");
  console.log(result)

  count ++
  if(count === 3){
    clearInterval(loop)
  }

  console.log("done")
},1000)