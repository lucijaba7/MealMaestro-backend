const express = require("express");
const ingredientMiddleware = require("../middleware/ingredientMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware.protect, ingredientMiddleware.getGroceryList);

router
  .route("/:id")
  .patch(ingredientMiddleware.updateGroceryList)
  .post(ingredientMiddleware.confirmGroceryList);

module.exports = router;
