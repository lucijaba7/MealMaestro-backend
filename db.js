//const mongo = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

let connection_string =
  "mongodb+srv://lucijaba7:2CfHrh1ToLuQiJFC@cluster0.dove2.mongodb.net/MealMaestro?retryWrites=true&w=majority";

let client = new MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = null;

// eksportamo Promise koji resolva na konekciju
export default () => {
  return new Promise((resolve, reject) => {
    // ako smo inicijalizirali bazu i klijent je još uvijek spojen
    if (db && client.isConnected()) {
      resolve(db);
    } else {
      client.connect((err) => {
        if (err) {
          reject("Spajanje na bazu nije uspjelo:" + err);
        } else {
          console.log("Database connected successfully!");
          db = client.db("MealMaestro");
          resolve(db);
        }
      });
    }
  });
};
