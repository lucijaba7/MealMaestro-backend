import express from "express";
import ingredientMiddleware from "../Middleware/ingredientMiddleware";
import authMiddleware from "../Middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware.protect, ingredientMiddleware.getGroceryList);

router
  .route("/:id")
  .patch(authMiddleware.protect, ingredientMiddleware.updateGroceryList)
  .post(authMiddleware.protect, ingredientMiddleware.confirmGroceryList);

module.exports = router;
