import express from "express";
import planMiddleware from "../Middleware/planMiddleware";
import authMiddleware from "../Middleware/authMiddleware";

const router = express.Router();

router
  .route("/:id/remove")
  .patch(authMiddleware.protect, planMiddleware.deleteMeal);
router.route("/:id/add").patch(authMiddleware.protect, planMiddleware.addMeal);
router
  .route("/:id/cook")
  .patch(authMiddleware.protect, planMiddleware.cookMeal);

module.exports = router;
