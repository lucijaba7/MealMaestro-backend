const express = require("express");
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", authMiddleware.signup);
router.post("/login", authMiddleware.login);

module.exports = router;
