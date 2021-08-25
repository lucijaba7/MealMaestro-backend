const express = require("express");
const ingredientMiddleware = require("../middleware/ingredientMiddleware");

const router = express.Router();

router.route("/").get(ingredientMiddleware.getFridge);
router.route("/:id").patch(ingredientMiddleware.updateFridge);

router.route("/:id/add").patch(ingredientMiddleware.addIngredient);

module.exports = router;
