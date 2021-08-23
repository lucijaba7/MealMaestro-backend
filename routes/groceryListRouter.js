const express = require("express");
const ingredientMiddleware = require("../middleware/ingredientMiddleware");

const router = express.Router();

router.route("/").get(ingredientMiddleware.getGroceryList);

router
  .route("/:id")
  .patch(ingredientMiddleware.updateGroceryList)
  .post(ingredientMiddleware.confirmGroceryList);

module.exports = router;
