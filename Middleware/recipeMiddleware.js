const Recipe = require("../schemas/recipeSchema");
const Ingredient = require("../schemas/ingredientSchema");
const multer = require("multer");
const upload = require("../middleware/imageUploadMiddleware");

// app.get("/recipes/:category", (req, res) => {
//   let category = req.params.category;
//   let username = req.query.username;

//   // ovo ce radit Mongo
//   let recipes = data.recipes.filter((x) => x.username == username);
//   let fridge_items = fridge[0].fridge_items.filter(
//     (x) => x.category == category
//   );

//   res.json(fridge_items);
// });

// app.post("/recipes", (req, res) => {
//   let doc = req.body;
//   console.log(doc.image);
//   // data.recipes.push(doc)
//   // console.log(data.recipes)
//   res.json({ status: "ok" });
// });

exports.createRecipe =
  (multer().array("image"),
  async (req, res, next) => {
    let data = await upload(req.files[0]);

    console.log(data.url);

    // naci id z svaki ingr

    // var ingredients_list = [];
    // for (var ingredient of req.body.ingredientsList) {
    //   // const ingredientId = await Ingredient.find({
    //   //   ingredient_name: "shrimp",
    //   // });
    //   // .then((result) => {
    //   //   res.send(result);
    //   // })
    //   // .catch((err) => console.log(err));
    //   console.log(ingredient);
    // }

    // console.log(req.body);

    // napravi objekt

    //   console.log("body: ", req.body); // tu su druge info o receptu
    //   console.log("image:", req.files[0]); // tu je slika

    // data.recipes.push(doc)
    // console.log(data.recipes)

    res.json({ status: "ok" });
  });

router.route("/").get((req, res, next) => {
  Recipe.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
