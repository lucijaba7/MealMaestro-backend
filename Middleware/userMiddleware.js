import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import User from "../schemas/userSchema";
import Avatar from "../schemas/avatarSchema";
import Recipe from "../schemas/recipeSchema";

exports.getCustomRecipes = async (req, res, next) => {
  const userData = await User.findById(req.params.id);
  const customRecipes = [];

  for (let recipeId of userData.custom_recipes) {
    const recipe = await Recipe.findById(recipeId);
    customRecipes.push(recipe);
  }

  res.json(customRecipes);
};

exports.updateMyData = asyncHandler(async (req, res, next) => {
  console.log(req);
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
