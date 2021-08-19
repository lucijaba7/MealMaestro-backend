const Recipe = require("../schemas/recipeSchema");
const User = require("../schemas/userSchema");
const upload = require("../middleware/imageUploadMiddleware");

exports.getRecipes = (req, res, next) => {
  if (req.query.mealType)
    Recipe.find({ meal_type: req.query.mealType })
      .limit(10)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
  else
    Recipe.find() //.limit(10)
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
  const recipe = await Recipe.findById(req.params.id);
  res.send(recipe);
};
