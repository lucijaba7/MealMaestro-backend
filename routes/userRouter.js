const express = require("express");
import authMiddleware from "../middleware/authMiddleware";
import userMiddleware from "../middleware/userMiddleware";

const router = express.Router();

router.route("/signup").post(authMiddleware.signup);
router.route("/login").post(authMiddleware.login);

router
  .route("/customRecipes")
  .get(authMiddleware.protect, userMiddleware.getCustomRecipes);

router
  .route("/customRecipes/remove")
  .patch(authMiddleware.protect, userMiddleware.removeFromCustomRecipes);

router
  .route("/savedRecipes")
  .get(authMiddleware.protect, userMiddleware.getSavedRecipes)
  .patch(authMiddleware.protect, userMiddleware.saveRecipe);

router
  .route("/savedRecipes/remove")
  .patch(authMiddleware.protect, userMiddleware.removeFromSavedRecipes);

router
  .route("/followUser")
  .patch(authMiddleware.protect, userMiddleware.followUser);

router
  .route("/unfollowUser")
  .patch(authMiddleware.protect, userMiddleware.unfollowUser);

router
  .route("/getFollowersNumber")
  .get(authMiddleware.protect, userMiddleware.getFollowersNumber);

router
  .route("/updatePassword")
  .patch(authMiddleware.protect, authMiddleware.changePassword);

router.patch(
  "/updateMyData",
  authMiddleware.protect,
  userMiddleware.updateMyData
);

router
  .route("/:username")
  .get(authMiddleware.protect, userMiddleware.getUserData);

router
  .route("/:username/customRecipes")
  .get(authMiddleware.protect, userMiddleware.getUserRecipes);

module.exports = router;
