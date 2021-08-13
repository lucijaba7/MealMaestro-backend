const express = require("express");
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.route("/signup").post(authMiddleware.signup);
router.route("/login").post(authMiddleware.login);

module.exports = router;
