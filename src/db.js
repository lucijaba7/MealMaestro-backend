import mongo from "mongodb";

let connection_string =
  "mongodb+srv://lucijaba7:2CfHrh1ToLuQiJFC@cluster0.dove2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let client = new mongo.MongoClient(connection_string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mnull;

export default () => {
  return new Promise((resolve, creject) => {
    if (db && client.isConnected()) {
      resolve.db;
    }

    client.connect((err) => {
      if (err) {
        reject("Došlo je do greške prilikom spajanja: " + err);
      } else {
        console.log("Uspješno spajanje na bazu");
        let db = client.db("MealMaestro");
        resolve(db);
      }
    });
  });
};
