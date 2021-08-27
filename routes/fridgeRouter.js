const express = require("express");
const ingredientMiddleware = require("../middleware/ingredientMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware.protect, ingredientMiddleware.getFridge)
  .post(authMiddleware.protect, ingredientMiddleware.createFridge);

router.route("/:id").patch(ingredientMiddleware.updateFridge);

router.route("/:id/add").patch(ingredientMiddleware.addIngredient);

module.exports = router;
