
import mongodb from 'mongodb';
import apikey from './apikey.js'
const mongo = mongodb.MongoClient;
//const mongodb = new MongoClient(apikey.uri, { useNewUrlParser: true, useUnifiedTopology: true });

// mongodb.connect(err => {
//   const collection = client.db("coin-record").collection("record");
//   // perform actions on the collection object
//   collection.find().toArray((err, items) => {
//     console.log(items)
//   })
//   client.close();
// });

mongo.connect(apikey.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
  //...
  const db = client.db('trade-record')
  const collection = db.collection('record')
  collection.insertOne({what:SoB, which:which, how:howmuch}, (err, result) => {
    console.log(result)
    client.close()
  })
})