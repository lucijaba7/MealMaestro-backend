import express from "express";
import ingredientMiddleware from "../Middleware/ingredientMiddleware";
import authMiddleware from "../Middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware.protect, ingredientMiddleware.getFridge)
  .post(authMiddleware.protect, ingredientMiddleware.createFridge);

router
  .route("/:id")
  .patch(authMiddleware.protect, ingredientMiddleware.updateFridge);

router
  .route("/:id/add")
  .patch(authMiddleware.protect, ingredientMiddleware.addIngredient);

module.exports = router;
