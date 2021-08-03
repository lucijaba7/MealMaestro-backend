import express from "express";
import data from "./data.json";
import cors from "cors";
import connect from "./db.js";

const app = express(); // instanciranje aplikacije
const port = 4000; // port na kojem će web server slušati
app.use(cors());
app.use(express.json());

// app.get("/posts", async (req, res) => {
//   let db = await connect();

//   let cursor = await db.collection("fridge").find().sort({ category });
//   let restults = await cursor.toArray();

//   res.json();
// });

/* OVO JE OD PRIJE: */
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
app.get("/recipes", (req, res) => res.json(data.recipes));

// moje za uhvatiti FK nekako nezzz
app.get("/ingredients", async (req, res) => {
  let db = await connect();
  let cursor = await db.collection("ingredients").find();
  let results = await cursor.toArray();
  res.json(results);
});
//

app.listen(port, () => console.log(`Slušam na portu ${port}!`));
