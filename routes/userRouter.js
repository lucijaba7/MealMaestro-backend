const express = require("express");
import authMiddleware from "../middleware/authMiddleware";
import userMiddleware from "../middleware/userMiddleware";

const router = express.Router();

router.post("/signup", authMiddleware.signup);
router.post("/login", authMiddleware.login);
router.get("/info", userMiddleware.getAllUsers);
router.route("/:id/customRecipes").get

module.exports = router;
