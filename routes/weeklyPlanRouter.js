const express = require("express");
import planMiddleware from "../middleware/planMiddleware";

const router = express.Router();

router
  .route("/")
  .get(planMiddleware.getWeeklyPlan)
  .post(planMiddleware.createWeeklyPlan);

module.exports = router;
