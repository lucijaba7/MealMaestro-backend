const express = require("express");
import planMiddleware from "../middleware/planMiddleware";
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(authMiddleware.protect, planMiddleware.getWeeklyPlan)
  .post(authMiddleware.protect, planMiddleware.createWeeklyPlan);

router
  .route("/:id/confirmPlan")
  .post(
    authMiddleware.protect,
    planMiddleware.confirmPlan,
    planMiddleware.createGroceryList
  );

module.exports = router;
