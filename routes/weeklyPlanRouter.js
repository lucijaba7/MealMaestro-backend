import express from "express";
import planMiddleware from "../middleware/planMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .get(planMiddleware.getWeeklyPlan)
  .post(planMiddleware.createWeeklyPlan);

router
  .route("/:id/confirmPlan")
  .post(planMiddleware.confirmPlan, planMiddleware.createGroceryList);

module.exports = router;
