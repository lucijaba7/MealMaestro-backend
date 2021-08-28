import express from "express";
import ingredientMiddleware from "../middleware/ingredientMiddleware";

const router = express.Router();

router.route("/").get(ingredientMiddleware.getAllIngredients);

module.exports = router;
