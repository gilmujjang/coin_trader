import { coinprice } from './search.js';

setInterval(() => {
  coinprice("BTC")
},10000)