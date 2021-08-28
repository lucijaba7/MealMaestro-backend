import express from "express";
import asyncHandler from "../utils/asyncHandler";
import Avatar from "../schemas/avatarSchema";

const router = express.Router();

router.route("/").get(
  asyncHandler(async (req, res, next) => {
    const avatars = await Avatar.find();
    res.send(avatars);
  })
);

module.exports = router;
