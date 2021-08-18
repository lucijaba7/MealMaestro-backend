import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import User from "../schemas/userSchema";
const Recipe = require("../schemas/recipeSchema");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getCustomRecipes = async (req, res, next) => {
  const userData = await User.findById(req.params.id);

  const customRecipes = await Promise.all(
    userData.custom_recipes.map(async (recipe) => {
      return await Recipe.findById(recipe);
    })
  );

  if (req.query.mealType)
    res.send(
      customRecipes.filter((recipe) => recipe.meal_type == req.query.mealType)
    );
  else res.send(customRecipes);
};

exports.getSavedRecipes = async (req, res, next) => {
  const userData = await User.findById(req.params.id);

  const savedRecipes = await Promise.all(
    userData.saved_recipes.map(async (recipe) => {
      return await Recipe.findById(recipe);
    })
  );

  if (req.query.mealType)
    res.send(
      savedRecipes.filter((recipe) => recipe.meal_type == req.query.mealType)
    );
  else res.send(savedRecipes);
};
