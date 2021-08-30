import express from "express";
import ingredientMiddleware from "../Middleware/ingredientMiddleware";
import authMiddleware from "../Middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware.protect, ingredientMiddleware.getAllIngredients);

module.exports = router;
