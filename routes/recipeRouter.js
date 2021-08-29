import express from "express";
import multer from "multer";
import recipeMiddleware from "../Middleware/recipeMiddleware";
import ingredientMiddleware from "../Middleware/ingredientMiddleware";

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

router.route("/recommend").get(recipeMiddleware.recommendRecipes);

router.route("/:id").get(recipeMiddleware.getRecipeById);

router
  .route("/:id/rating")
  .get(recipeMiddleware.getRatings)
  .patch(recipeMiddleware.rateRecipe);

module.exports = router;
