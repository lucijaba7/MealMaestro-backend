const express = require("express");
const Avatar = require("../schemas/avatarSchema");

const router = express.Router();

router.route("/").get((req, res, next) => {
  Avatar.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
