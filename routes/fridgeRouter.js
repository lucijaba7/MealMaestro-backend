import express from "express";
import ingredientMiddleware from "../Middleware/ingredientMiddleware";

const router = express.Router();

router
  .route("/")
  .get(ingredientMiddleware.getFridge)
  .post(ingredientMiddleware.createFridge);

router.route("/:id").patch(ingredientMiddleware.updateFridge);

router.route("/:id/add").patch(ingredientMiddleware.addIngredient);

module.exports = router;
