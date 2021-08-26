const express = require("express");
const multer = require("multer");
import authMiddleware from "../middleware/authMiddleware";
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

router
  .route("/recommend")
  .get(authMiddleware.protect, recipeMiddleware.recommendRecipes);

router.route("/:id").get(recipeMiddleware.getRecipeById);
router
  .route("/:id/rating")
  .get(recipeMiddleware.getRatings)
  .patch(authMiddleware.protect, recipeMiddleware.rateRecipe);

module.exports = router;
