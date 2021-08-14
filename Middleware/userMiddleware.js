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
  const userData = await User.findById(req.params.id)
  const customRecipes = [];

  for(let recipeId of userData.custom_recipes ){
    const recipe = await Recipe.findById(recipeId)
    customRecipes.push(recipe)    
  }
  
  res.json(customRecipes)
}
