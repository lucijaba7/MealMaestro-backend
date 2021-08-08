const express = require("express");
const User = require("../schemas/userSchema");
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", authMiddleware.signup);

module.exports = router;
