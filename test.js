function a(callback){
  setTimeout(function(){
    console.log("start");
    callback();
  },1000)
}

function b(){
  console.log("finish");
}

a(b)