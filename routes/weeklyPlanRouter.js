import express from "express";
import planMiddleware from "../Middleware/planMiddleware";
import authMiddleware from "../Middleware/authMiddleware";

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
