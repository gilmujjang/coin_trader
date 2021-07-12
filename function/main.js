import search_coins from './search_coins.js'
import balance from './balance.js'
import balance_units from './balance_units.js'
import candle_price from './candle_price.js'
import trade from './trade.js'
import { dbService } from './fbase.js';
import moment from 'moment'


// mybalance()
// search("BTC")
// trade("sell","btc",0.0001)

let count = 0;
const sd = 1.5;
const ma = 480;  //20일 은 480시간

const btc_list = new Array(ma);
const eth_list = new Array(ma);
const bnb_list = new Array(ma);
const lists_list = [btc_list, eth_list,bnb_list];
const target_coin_list = ["BTC", "ETH","BNB"];
const target_coin_status = [false, false, false];
let num = [[],[],[]];
let center =  [[],[],[]];
let top =  [[],[],[]];
let bottom = [[],[],[]];

async function init_function(){
  const my_asset = await balance(target_coin_list)
  const my_asset_units = await balance_units(target_coin_list);
  console.log("계좌 상태")
  console.log("현금 :",my_asset[0])
  for(let i=1; i<my_asset.length; i++){
    console.log(target_coin_list[i-1],":",my_asset[i])
  }
  const time = moment().format('YYYYMMDDHHmmss');
  const balance_obj = {
    time: time,
    cash: my_asset[0],
    btc: my_asset[1],
    eth: my_asset[2],
    bnb: my_asset[3]
  }
  dbService.collection("balance").doc(time).set(balance_obj)
  console.log("일일 계좌 저장")
  for(let i=0; i< lists_list.length; i++){
    lists_list[i] = await candle_price(target_coin_list[i],"1h",ma)
  }
}

init_function();

async function MainLoop() {
  // 시세 감시
  setInterval(async function() {
    // 최근가격 갱신
    const coins_price = await search_coins(target_coin_list);
    for(let i=0; i< lists_list.length; i++){
      for (let j=lists_list[i].length-1; j>0; j--){
        lists_list[i][j]= lists_list[i][j-1];
      }
      lists_list[i][0] = coins_price[i];

      // 볼린저밴드 계산
      const n = lists_list[i].length;
      const Mean = Math.round(lists_list[i].reduce((a,b) => a+b,0) / n);
      const Std = Math.round(Math.sqrt(lists_list[i].map(x => Math.pow(x - Mean,2)).reduce((a,b) => a+b)/n))
      const bollinger_top = Mean + Std*sd;
      const bollinger_bottom = Mean - Std*sd;
      let high = 100000000;

      num[i].push(count);
      center[i].push(Mean);
      top[i].push(bollinger_top);
      bottom[i].push(bollinger_bottom);


      if(arget_coin_status[i] == true){
        high = Math.max(...lists_list[i])
      }

      if(coins_price[i] > bollinger_top && target_coin_status[i] == false){
        trade("buy",target_coin_list[i],Math.round((my_asset[0]/2)/coins_price[i],4));
        target_coin_status[i] = true;
        console.log(target_coin_list[i],"볼린저 상단 터치");
        const my_asset = await balance(target_coin_list);
        const my_asset_units = await balance_units(target_coin_list);
      }
      if(coins_price[i] < high*0.9 && target_coin_status[i] == true){
        trade("sell",target_coin_list[i],my_asset_units[i]);
        target_coin_status[i] = false;
        console.log(target_coin_list[i],"고가에서 10% 하락");
        const my_asset = await balance(target_coin_list);
        const my_asset_units = await balance_units(target_coin_list);
      }
      const time = moment().format('YYYYMMDDHHmmss');
      const coin_price_obj = {
        time, time,
        center: Mean,
        top: bollinger_top,
        bottom: bollinger_bottom
      }
      dbService.collection(lists_list[i]+"_price").doc(time).set(coin_price_obj)
    }
    count ++;
    console.log(count,"회 실행중");
  },3600000)
  // 계좌 조회
  setInterval(async function() {
    const my_asset = await balance(target_coin_list);
    const my_asset_units = await balance_units(target_coin_list);
    const time = moment().format('YYYYMMDDHHmmss');

    const balance_obj = {
      time: time,
      cash: my_asset[0],
      btc: my_asset[1],
      eth: my_asset[2],
      bnb: my_asset[3]
    }
    dbService.collection("balance").doc(time).set(balance_obj)
    console.log("일일 계좌 저장")
    console.log(my_asset);
  
  },86400000)
}

MainLoop()