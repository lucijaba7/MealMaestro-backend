//const mongo = require("mongodb");
import connect from "./db";
import bcrypt from "bcrypt";

(async () => {
  let db = await connect();
  console.log("AAAAA");
  await db.collection("users").createIndex({ username: 1 }, { unique: true });
})();

export default {
  async registerUser(userData) {
    console.log("TU SAMM");
    let db = await connect();
    console.log("TU SAMM 2");

    let result;
    // await db.collection("users").createIndex({ username: 1 }, { unique: true });

    try {
      let doc = {
        username: userData.username,
        password: await bcrypt.hash(userData.password, 8), // hashiram lozinku pomocu bcrypt-a, 8 je "salt"
        grad: userData.grad,
      };

      result = await db.collection("users").insertOne(doc);
    } catch (e) {
      if (e.name == "MongoServerError" && e.code == 11000) {
        throw new Error("Username already exists!");
      }
      // console.log(e);
    }

    if (result && result.insertedId) {
      return result.insertedId;
    } else {
      throw new Error("Cannot register user");
    }
  },
};
