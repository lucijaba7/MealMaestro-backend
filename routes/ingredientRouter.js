import express from "express";
import ingredientMiddleware from "../Middleware/ingredientMiddleware";

const router = express.Router();

router.route("/").get(ingredientMiddleware.getAllIngredients);

module.exports = router;
