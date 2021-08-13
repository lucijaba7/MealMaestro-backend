const Recipe = require("../schemas/recipeSchema");
const Ingredient = require("../schemas/ingredientSchema");
const User = require("../schemas/userSchema");
const multer = require("multer");
const upload = require("../middleware/imageUploadMiddleware");

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

exports.getRecipes = (req, res, next) => {
  Recipe.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
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

// exports.getRecipeId = async (req, res, next) => {
//   const recipe = await Recipe.findById(req.params.id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       recipe
//     }
//   })
// };

// Recipe.findById(id, function (err, docs) {
//   if (err){
//       console.log(err);
//   }
//   else{
//       console.log("Result : ", docs);
//   }
// });

exports.getRecipeById = async (req, res, next) => {
  // res.send(req.params.id)
  const recipe = await Recipe.findById(req.params.id)
  res.json({recipe})  
}


