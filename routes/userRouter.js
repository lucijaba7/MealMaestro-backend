const express = require("express");
import authMiddleware from "../middleware/authMiddleware";
import userMiddleware from "../middleware/userMiddleware";

const router = express.Router();

router.post("/signup", authMiddleware.signup);
router.post("/login", authMiddleware.login);
router.route("/:id/customRecipes").get;

router.patch(
  "/updatePassword",
  authMiddleware.protect,
  authMiddleware.changePassword
);

router.patch(
  "/updateMyData",
  authMiddleware.protect,
  userMiddleware.updateMyData
);

module.exports = router;
