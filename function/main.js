import search_coins from './search_coins.js'
import balance from './balance.js'
import balance_units from './balance_units.js'
import candle_price from './candle_price.js'
import trade from './trade.js'
import { dbService } from './fbase.js';
import moment from 'moment'

let count = 0;
const sd = 1.5;
const ma = 480;  //20일 은 480시간

const btc_list = new Array(ma);
const eth_list = new Array(ma);
const bnb_list = new Array(ma);
const lists_list = [btc_list, eth_list,bnb_list];
const target_coin_list = ["BTC", "ETH","BNB"];
let target_coin_status = [false, false, false];
let hold_coin_num = 0;
let my_asset = new Array(4);
let my_asset_units = new Array(3);

async function init_function(){
  daily_save();
  for(let i=0; i< lists_list.length; i++){
    lists_list[i] = await candle_price(target_coin_list[i],"1h",ma)
  }
  my_asset = await balance(target_coin_list);
  for(let i=0; i<3; i++){
    if(my_asset[i+1]>10000){
      target_coin_status[i] = true;
      hold_coin_num = hold_coin_num +1;
    } else {
      target_coin_status[i] = false;
    }
  }
  main_function();
}

async function main_function() {
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
    const high = Math.max(...lists_list[i])

    if(coins_price[i] > bollinger_top && target_coin_status[i] == false){
      if(hold_coin_num==3){
        console.log("보유코인3가지임 아무튼 에러임");
        return
      }
      trade("buy",target_coin_list[i],((my_asset[0]/(3-hold_coin_num))/coins_price[i]).toFixed(4));
      target_coin_status[i] = true;
      hold_coin_num = hold_coin_num+1;
      console.log(target_coin_list[i],"볼린저 상단 돌파");
      my_asset = await balance(target_coin_list);
    }
    if(coins_price[i] < high*0.9 && target_coin_status[i] == true && coins_price[i] < bollinger_top){
      my_asset_units = await balance_units(target_coin_list);
      trade("sell",target_coin_list[i],my_asset_units[i]);
      target_coin_status[i] = false;
      hold_coin_num = hold_coin_num-1;
      console.log(target_coin_list[i],"고가에서 10% 하락");
      my_asset = await balance(target_coin_list);
      my_asset_units = await balance_units(target_coin_list);
    }
  }

  count ++;
  if(count % 6 == 0){
    const time = moment().format('YYYYMMDDHHmmss');
    const coin_price_obj = {
      time: time,
      price: coins_price[i],
      center: Mean,
      top: bollinger_top,
      bottom: high*0.9
    }
    dbService.collection(target_coin_list[i]+"_price").doc(time).set(coin_price_obj)
  }
  console.log(count/6,"회 실행중");
}


async function daily_save(){
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
}



// 메인 프로그램 시작
init_function();

async function MainLoop() {
  // 시세 감시
  setInterval(async function() {
    main_function();
  },600000)
  // 계좌 조회
  setInterval(async function() {
    daily_save();
  },86400000)
}

MainLoop()