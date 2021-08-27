const Recipe = require("../schemas/recipeSchema");
const User = require("../schemas/userSchema");
const mongoose = require("mongoose");
const upload = require("../middleware/imageUploadMiddleware");

exports.getRecipes = async (req, res, next) => {
  let recipes = await Recipe.find();
  res.json(recipes);
};

exports.getImageUrl = async (req, res, next) => {
  // console.log(req.files);
  let data = await upload(req.files[0]);
  console.log(data.url);
  res.json({ url: data.url });
};

exports.createRecipe = async (req, res, next) => {
  const userData = await User.findById(req.body.userId);

  var data = {
    name: req.body.mealName,
    image: req.body.image,
    meal_type: req.body.mealType,
    servings: req.body.servings,
    total_time: req.body.totalTime,
    username: userData.username,
    ingredients_list: req.body.ingredientsList,
    directions: req.body.directions,
    tags: req.body.tags,
    date_created: req.body.date,
  };

  const recipe = await Recipe.create(data);

  // ovo se moze iscupati al nez u koj middleware bi islo

  await User.updateOne(
    { _id: req.body.userId },
    { $push: { custom_recipes: recipe._id } }
  );

  res.json({ recipe });
};

exports.getRecipeById = async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  res.send(recipe);
};

exports.recommendRecipes = async (req, res, next) => {
  const userData = await User.findById(req.user._id);
  const preferences = userData.preferences;
  let queryObject = {};

  if (req.query.mealType) queryObject["meal_type"] = req.query.mealType;
  if (preferences.length) queryObject["tags"] = { $all: preferences };

  var recipes = await Recipe.find(queryObject)
    .skip(parseInt(req.query.offset))
    .limit(10);

  res.send(recipes);
};

exports.rateRecipe = async (req, res, next) => {
  const response = await Recipe.updateOne(
    { _id: req.params.id },
    { $push: { ratings: req.body } }
  );

  console.log(response);
  // console.log(req.params.id);
  // console.log(req.body);

  res.status(200).json({
    status: "succes",
    data: null,
  });
};

exports.getRatings = async (req, res, next) => {
  Recipe.aggregate(
    [
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      { $unwind: "$ratings" },
      { $group: { _id: null, rating: { $avg: "$ratings.rate" } } },
    ],
    function (err, recipeRating) {
      res.send(recipeRating);
    }
  );
};
