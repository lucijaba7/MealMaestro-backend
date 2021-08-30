import express from "express";
import multer from "multer";
import recipeMiddleware from "../Middleware/recipeMiddleware";
import ingredientMiddleware from "../Middleware/ingredientMiddleware";
import authMiddleware from "../Middleware/authMiddleware";

const router = express.Router();

router
  .route("/getImageUrl")
  .post(multer().array("image"), recipeMiddleware.getImageUrl);

router
  .route("/")
  .get(authMiddleware.protect, recipeMiddleware.getRecipes)
  .post(
    authMiddleware.protect,
    ingredientMiddleware.getIngredientsIdFromName,
    recipeMiddleware.createRecipe
  );

router
  .route("/recommend")
  .get(authMiddleware.protect, recipeMiddleware.recommendRecipes);

router
  .route("/:id")
  .get(authMiddleware.protect, recipeMiddleware.getRecipeById);

router
  .route("/:id/rating")
  .get(authMiddleware.protect, recipeMiddleware.getRatings)
  .patch(authMiddleware.protect, recipeMiddleware.rateRecipe);

module.exports = router;
