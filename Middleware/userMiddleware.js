import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import User from "../schemas/userSchema";
import Avatar from "../schemas/avatarSchema";
import Recipe from "../schemas/recipeSchema";
var mongoose = require("mongoose");

exports.getCustomRecipes = asyncHandler(async (req, res, next) => {
  const userData = await User.findById(req.user._id);
  let userCustomRecipes = [];

  if (req.query.start && req.query.end) {
    const start = req.query.start;
    const end = req.query.end;
    console.log(start, "-", end);

    userCustomRecipes = [...userData.custom_recipes.slice(start, end)];
  } else {
    userCustomRecipes = [...userData.custom_recipes];
  }

  const customRecipes = await Promise.all(
    userCustomRecipes.map(async (recipe) => {
      return await Recipe.findById(recipe);
    })
  );

  if (req.query.mealType) {
    res.send(
      customRecipes
        .filter((recipe) => recipe.meal_type == req.query.mealType)
        .slice(0, 10)
    );
  } else res.send(customRecipes);
});

exports.removeFromCustomRecipes = asyncHandler(async (req, res, next) => {
  const customRecipes = await User.updateOne(
    { _id: req.user._id },
    { $pull: { custom_recipes: req.query.recipeId } }
  );

  const recipes = await Recipe.deleteOne({ _id: req.query.recipeId });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getSavedRecipes = asyncHandler(async (req, res, next) => {
  const userData = await User.findById(req.user._id);
  console.log(userData);
  let userSavedRecipes = [];

  if (req.query.start && req.query.end) {
    const start = req.query.start;
    const end = req.query.end;
    console.log(start, "-", end);

    userSavedRecipes = [...userData.saved_recipes.slice(start, end)];
  } else {
    userSavedRecipes = [...userData.saved_recipes];
  }

  const savedRecipes = await Promise.all(
    userSavedRecipes.map(async (recipe) => {
      return await Recipe.findById(recipe);
    })
  );

  if (req.query.mealType) {
    res.send(
      savedRecipes
        .filter((recipe) => recipe.meal_type == req.query.mealType)
        .slice(0, 10)
    );
  } else res.send(savedRecipes);
});

exports.saveRecipe = asyncHandler(async (req, res, next) => {
  const savedRecipes = await User.updateOne(
    { _id: req.user._id },
    { $push: { saved_recipes: req.query.recipeId } }
  );

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.removeFromSavedRecipes = asyncHandler(async (req, res, next) => {
  const savedRecipes = await User.updateOne(
    { _id: req.user._id },
    { $pull: { saved_recipes: req.query.recipeId } }
  );

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.followUser = asyncHandler(async (req, res, next) => {
  const response = await User.updateOne(
    { _id: req.user._id },
    { $push: { following: req.query.userId } }
  );

  const updatedUser = await User.findById(req.user._id);

  res.status(200).json({
    status: "succes",
    data: {
      user: updatedUser,
    },
  });
});

exports.unfollowUser = asyncHandler(async (req, res, next) => {
  const response = await User.updateOne(
    { _id: req.user._id },
    { $pull: { following: req.query.userId } }
  );

  const updatedUser = await User.findById(req.user._id);

  res.status(200).json({
    status: "succes",
    data: {
      user: updatedUser,
    },
  });
});

exports.getFollowersNumber = asyncHandler(async (req, res, next) => {
  User.aggregate(
    [
      {
        $project: { following: 1 },
      } /* select the following field as something we want to "send" to the next command in the chain */,
      {
        $unwind: "$following",
      } /* this converts arrays into unique documents for counting */,
      {
        $group: {
          /* execute 'grouping' */
          _id: "$following",
          count: { $sum: 1 },
        },
      },
    ],
    function (err, followersNumber) {
      console.log(followersNumber);
      res.send(followersNumber);
    }
  );
});

exports.updateMyData = asyncHandler(async (req, res, next) => {
  // 1) Create error if user posts password data
  if (req.body.newPassword || req.body.confirmPassword) {
    return next(new ErrorHandler("Action not allowed"), 400);
  }

  // 2) Filter out unwanted fields that aren't allowed to be updated
  const filteredReqBody = filterObj(req.body, "about_you", "username", "email");
  if (req.body.avatar_url) {
    const avatarUrl = await Avatar.findOne(
      { url: req.body.avatar_url },
      { _id: 1 }
    );

    filteredReqBody.avatar = avatarUrl._id;
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    filteredReqBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "succes",
    data: {
      user: updatedUser,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
  const filtered = {};
  Object.keys(obj).forEach((field) => {
    if (allowedFields.includes(field)) filtered[field] = obj[field];
  });
  return filtered;
};

exports.getUserData = asyncHandler(async (req, res, next) => {
  const userData = await User.findOne({ username: req.params.username });
  res.send(userData);
});

exports.getUserRecipes = asyncHandler(async (req, res, next) => {
  const userData = await User.findOne({ username: req.params.username });

  const userRecipes = await Promise.all(
    userData.custom_recipes.map(async (recipe) => {
      return await Recipe.findById(recipe);
    })
  );

  res.send(userRecipes);
});
