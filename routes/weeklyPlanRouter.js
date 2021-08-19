const express = require("express");
import planMiddleware from "../middleware/planMiddleware";

const router = express.Router();

router
  .route("/")
  .get(planMiddleware.getWeeklyPlan)
  .post(planMiddleware.createWeeklyPlan);

router
  .route("/:id/confirmPlan")
  .post(planMiddleware.confirmPlan, planMiddleware.createGroceryList);

module.exports = router;
