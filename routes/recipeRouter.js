const express = require("express");
const multer = require("multer");
const recipeMiddleware = require("../middleware/recipeMiddleware");

const router = express.Router();

router
  .route("/getImageUrl")
  .post(multer().array("image"), recipeMiddleware.getImageUrl);

router
  .route("/")
  .get(recipeMiddleware.getRecipes)
  .post(recipeMiddleware.createRecipe);

module.exports = router;
