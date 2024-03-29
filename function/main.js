import search_coins from './search_coins.js'
import balance from './balance.js'
import balance_units from './balance_units.js'
import candle_price from './candle_price.js'
import trade from './trade.js'
import { dbService } from './fbase.js';
import moment from 'moment'

let count = 6;
const sd = 1.5;
const ma = 480;  //20일 은 480시간

const target_coin_list = ["BTC", "ETH","BNB"];
let target_coin_status = [false, false, false];
let hold_coin_num = 0;
let my_asset = new Array(4);
let my_asset_units = new Array(3);

async function init_function(){
  //시작하면 일단 계좌잔액 저장하고 시작
  daily_save();

  my_asset = await balance(target_coin_list);
  for(let i=0; i<3; i++){
    //코인이 만원 이상 있으면 보유하고있다고 판단
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
  for(let i=0; i< target_coin_list.length; i++){
    // 최근가격 조회
    const recentCoinPrice =  await candle_price(target_coin_list[i],"1h",ma)
    // 볼린저밴드 계산
    const Mean = Math.round(recentCoinPrice.reduce((a,b) => a+b,0) / ma);
    const Std = Math.round(Math.sqrt(recentCoinPrice.map(x => Math.pow(x - Mean,2)).reduce((a,b) => a+b)/ma))
    const bollinger_top = Mean + Std*sd;
    const high = Math.max(...recentCoinPrice)
    const donkeyonBottom = high*0.9;
    const coinPrice = recentCoinPrice[0]

    //볼린저상단을 돌파 & 미보유 코인 & 매도점 이상이면 매수
    if(coinPrice > bollinger_top && target_coin_status[i] == false && coinPrice > donkeyonBottom){
      my_asset = await balance(target_coin_list);
      if(hold_coin_num === 2){
        trade("buy",target_coin_list[i],((my_asset[0] * 0.75)/coinPrice).toFixed(4));
      } else {
        trade("buy",target_coin_list[i],((my_asset[0] * 0.9/(target_coin_list.length-hold_coin_num))/coinPrice).toFixed(4));
      }
      target_coin_status[i] = true;
      hold_coin_num = hold_coin_num+1;
      console.log(target_coin_list[i],"볼린저 상단 돌파");
      //매수후 계좌정보 갱신
    }

    //최근20일 고가에서 -10% 하락 & 보유중인 코인 & 가격이 볼린저 상단 아래에 있으면 매도
    if(coinPrice < donkeyonBottom && target_coin_status[i] == true && coinPrice < bollinger_top){
      //보유중인 코인의 양을 갱신(금액이 아님)
      my_asset_units = await balance_units(target_coin_list);
      const units = my_asset_units[i];
      trade("sell",target_coin_list[i],((Math.floor(units*10000))/10000));
      target_coin_status[i] = false;
      hold_coin_num = hold_coin_num-1;
      console.log(target_coin_list[i],"고가에서 10% 하락");
    }
  }

  if(count % 6 == 0){
    const n = count/6;
    console.log(`${count-6}회 실행, ${n-1}시간 경과`);
  }
  
  count ++;
}

async function daily_save(){
  my_asset = await balance(target_coin_list);
  const total = my_asset.reduce(function add(sum, currentValue){
    return sum + currentValue;
  }, 0);
  const time = moment().format('YYYYMMDDHHmmss');
  const balance_obj = {
    time: time,
    cash: my_asset[0],
    btc: my_asset[1],
    eth: my_asset[2],
    bnb: my_asset[3],
    total: total
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
    try{
      main_function();
    } catch (error) {
      console.log(error);
    }
  },600000)
  // 계좌 조회
  setInterval(async function() {
    try{
      daily_save(my_asset);
    } catch (error) {
      console.log(error)
    }
  },86400000)
}

MainLoop();