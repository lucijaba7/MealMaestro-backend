const express = require("express");
const Ingredient = require("../schemas/ingredientSchema");

const router = express.Router();

router.route("/").get((req, res) => {
  Ingredient.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

// router.route("/:id").get((req, res) => {
//   let ingredientId = req.params.id;
//   Ingredient.find({ _id: ingredientId })
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => console.log(err));
// });

module.exports = router;
