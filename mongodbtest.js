import MongoClient from'mongodb';

const uri = "mongodb+srv://gilmu:<rlfan1919!>@coin-trader.kd6dr.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();