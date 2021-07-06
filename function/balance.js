import request from 'request';
import { make_header } from './api_function.js';

export default async function myaccount(){
  const api_base = 'https://api.bithumb.com';

  let req_query = {
    endpoint:"/info/balance",
    currency:"ALL"
  }
  request({
    method:'POST',
    uri:api_base+req_query['endpoint'],
    headers: make_header(req_query),
    formData:req_query
  }, (err, res, result) => {
    if(err){
      console.log(err)
      console.log("에러남")
      return
    }
    console.log(JSON.parse(result))
  })
}

myaccount()