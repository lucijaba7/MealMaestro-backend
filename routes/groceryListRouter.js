import express from "express";
import ingredientMiddleware from "../middleware/ingredientMiddleware";

const router = express.Router();

router.route("/").get(ingredientMiddleware.getGroceryList);

router
  .route("/:id")
  .patch(ingredientMiddleware.updateGroceryList)
  .post(ingredientMiddleware.confirmGroceryList);

module.exports = router;
