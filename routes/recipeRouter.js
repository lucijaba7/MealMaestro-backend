const express = require("express");
const Recipe = require("../schemas/recipeSchema");
const Ingredient = require("../schemas/ingredientSchema");
const multer = require("multer");
const upload = require("../middleware/imageUploadMiddleware");

const router = express.Router();

// app.get("/recipes/:category", (req, res) => {
//   let category = req.params.category;
//   let username = req.query.username;

//   // ovo ce radit Mongo
//   let recipes = data.recipes.filter((x) => x.username == username);
//   let fridge_items = fridge[0].fridge_items.filter(
//     (x) => x.category == category
//   );

//   res.json(fridge_items);
// });

// app.post("/recipes", (req, res) => {
//   let doc = req.body;
//   console.log(doc.image);
//   // data.recipes.push(doc)
//   // console.log(data.recipes)
//   res.json({ status: "ok" });
// });

router
  .route("/getImageUrl")
  .post(multer().array("image"), async (req, res, next) => {
    // console.log(req.files);
    let data = await upload(req.files[0]);
    console.log(data.url);
    res.json({ url: data.url });
  });

router.route("/").get((req, res, next) => {
  Recipe.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

router.route("/").post(async (req, res, next) => {
  var ingredients_list = [];

  for (var ingredient of req.body.ingredientsList) {
    const ingredientData = await Ingredient.find({
      ingredient_name: ingredient.ingredientName,
    });

    ingredients_list.push({
      ingredient: ingredientData[0]._id,
      unit: ingredient.unit,
      quantity: ingredient.quantity,
    });
  }

  var data = {
    name: req.body.mealName,
    image: req.body.image,
    meal_type: req.body.mealType,
    servings: req.body.servings,
    total_time: req.body.totalTime,
    username: req.body.username,
    ingredients_list: ingredients_list,
    directions: req.body.directions,
    tags: req.body.tags,
    date_created: req.body.date,
  };

  console.log(data);

  const recipe = await Recipe.create(data);
  res.json({ recipe });
});

module.exports = router;
