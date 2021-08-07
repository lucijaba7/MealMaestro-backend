import express from "express";
import data from "./data.json";
import cors from "cors";
//import connect from "./db";
//import auth from "./auth";

const mongoose = require("mongoose");
const multer = require("multer");
const Avatar = require("./models/avatar");
const Ingredient = require("./models/ingredient");
const Recipe = require("./models/recipe");

const app = express(); // instanciranje aplikacije
const port = 4000; // port na kojem će web server slušati
app.use(cors());
app.use(express.json());

let mongoURI =
  "mongodb+srv://lucijaba7:2CfHrh1ToLuQiJFC@cluster0.dove2.mongodb.net/MealMaestro?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
    app.listen(port, () => console.log(`Slušam na portu ${port}!`))
  ) //console.log("connected to db"))
  .catch((err) => console.log(err));

// Babic
// app.get("/posts", async (req, res) => {
//   let db = await connect();

//   let cursor = await db.collection("fridge").find().sort({ category });
//   let restults = await cursor.toArray();

//   res.json();
// });

// Postman: http://localhost:4000/users

app.post("/users", async (req, res) => {
  let user = req.body;
  let id;

  try {
    id = await auth.registerUser(user);
    res.status(201).json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }

  // res.json({ id: id });
});

// ---- PLAN ----

// GET DAILY PLAN
// Postman: GET http://localhost:4000/plan/daily?username=kuharica&startDay=2021-07-26&weekDay=Tuesday

// dohvati weekly plan koji ima taj username i start day pa dohvati recepte za weekDay

app.get("/ingredients", (req, res) => {
  Ingredient.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));

  // let db = await connect(); // pristup db objektu
  // let cursor = await db.collection("ingredients").find();
  // let results = await cursor.toArray();

  // res.json(results);
});

app.get("/plan/daily", (req, res) => {
  let username = req.query.username;
  let startDay = req.query.startDay;
  let weekDay = req.query.weekDay;

  console.log(startDay);

  // ovo ce radit Mongo
  let plan = data.weekly_plan.filter(
    (x) => x.username == username && x.start_day == startDay
  );
  let dailyPlan = plan[0].daily_meal.filter((el) => el.day == weekDay); // + Mongo mora dohvatit bas recepte, a  ja sam samo array sa id-jevima recepta

  res.json(dailyPlan);
});

// GET WEEKLY PLAN
// Postman GET http://localhost:4000/plan/weekly?username=kuharica&startDay=2021-08-01

// dohvati weekly plan koji ima taj username i start day

app.get("/plan/weekly", (req, res) => {
  let username = req.query.username;
  let startDay = req.query.startDay;

  // ovo ce radit Mongo
  let weeklyPlan = data.weekly_plan.filter(
    (x) => x.username == username && x.start_day == startDay
  );

  res.json(weeklyPlan[0].daily_meal);
});

// ---- FRIDGE ----

// Postman GET http://localhost:4000/fridge?username=kuharica&category=vegetables ovo neee
// Postman GET http://localhost:4000/fridge/vegetables?username=kuharica

app.get("/fridge/:category", (req, res) => {
  let category = req.params.category;
  category = category.charAt(0).toUpperCase() + category.slice(1);

  let username = req.query.username;

  // ovo ce radit Mongo
  let fridge = data.fridge.filter((x) => x.username == username);
  let fridge_items = fridge[0].fridge_items.filter(
    (x) => x.category == category
  );

  res.json(fridge_items);
});

// ---- GROCERY LIST ----

// Postman GET http://localhost:4000/groceryList?username=kuharica&startDay=2021-08-01

app.get("/groceryList", (req, res) => {
  let username = req.query.username;
  let startDay = req.query.startDay;

  // ovo ce radit Mongo
  let weeklyPlan = data.weekly_plan.filter(
    (x) => x.username == username && x.start_day == startDay
  );

  res.json(weeklyPlan[0].shopping_list);
});

// ---- RECIPES ----

// GET YOUR RECIPES

app.get("/recipes/:category", (req, res) => {
  let category = req.params.category;
  let username = req.query.username;

  // ovo ce radit Mongo
  let recipes = data.recipes.filter((x) => x.username == username);
  let fridge_items = fridge[0].fridge_items.filter(
    (x) => x.category == category
  );

  res.json(fridge_items);
});

// GET SAVED RECIPES

// POST A RECIPE

app.post("/recipes", multer().array("image"), (req, res) => {
  console.log("body: ", req.body); // tu su druge info o receptu
  console.log("image:", req.files); // tu je slika

  // data.recipes.push(doc)
  // console.log(data.recipes)
  res.json({ status: "ok" });
});

// ---- PROFILE ----

// GET USER DATA
// Postman GET http://localhost:4000/profile?username=kuharica

app.get("/profile", (req, res) => {
  let username = req.query.username;

  // ovo ce radit Mongo (treba dohvatit info o useru + njegove recepte)
  let user = data.user.filter((x) => x.username == username);
  res.json(user);
});

// PROFILE SETTINGS
// Postman GET http://localhost:4000/settings?username=kuharica

app.get("/settings", (req, res) => {
  let username = req.query.username;

  // ovo ce radit Mongo
  let user = data.user.filter((x) => x.username == username);
  res.json(user[0].settings);
});

/* STAROOOOO

//home
app.get("/", (req, res) => res.json(data.weekly_plan));
app.get("/:username", (req, res) => {
  let username = req.params.username;
  res.json(data.weekly_plan.filter((x) => x.username == username));
});
app.get("/:username/daily_meal", (req, res) => {
  let username = req.params.username;
  let weekly_plan = data.weekly_plan.filter(
    (x) => x.username == username && x.start_day == "16-07-2021"
  );
  console.log(weekly_plan);
  let todays_meal = weekly_plan[0].daily_meal.filter((x) => x.day == "Monday");

  res.json(todays_meal);
});

//recipes
app.get('/recipes/:username', (req, res) => {
    let username = req.params.username;
    let recipe = data.recipes.filter((x) => x.username == username)
    res.json(recipe)})

//post new recipe
app.post('/recipes/:username', (req, res) => {
    let doc = req.body
    data.recipes.push(doc)
    console.log(data.recipes)
    res.json({status: "ok"})
})

//fridge
app.get("/fridge/:username", (req, res) => {
    let username = req.params.username; 
    console.log(data.fridge)
    let fridge = data.fridge.filter((x) => x.username == username)
    let fridge_items = fridge[0].fridge_items    
    res.json(fridge_items)    
})

//user
app.get("/account/:username", (req, res) => {
    let username = req.params.username;
    let user = data.user.filter((x) => x.username == username)
    res.json(user)
})


*/

//app.listen(port, () => console.log(`Slušam na portu ${port}!`));
