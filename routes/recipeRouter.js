const express = require("express");
const multer = require("multer");
const recipeMiddleware = require("../middleware/recipeMiddleware");
const ingredientMiddleware = require("../middleware/ingredientMiddleware");

const router = express.Router();

router
  .route("/getImageUrl")
  .post(multer().array("image"), recipeMiddleware.getImageUrl);

router
  .route("/")
  .get(recipeMiddleware.getRecipes)
  .post(
    ingredientMiddleware.getIngredientsIdFromName,
    recipeMiddleware.createRecipe
  );

router.route("/:id").get(recipeMiddleware.getRecipeById);

module.exports = router;
