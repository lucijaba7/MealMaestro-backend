const Fridge = require("../schemas/fridgeSchema");
const GroceryList = require("../schemas/groceryListSchema");
const Ingredient = require("../schemas/ingredientSchema");

exports.getIngredientsIdFromName = async (req, res, next) => {
  var ingredients_list = [];

  for (var ingredient of req.body.ingredientsList) {
    const ingredientData = await Ingredient.find({
      ingredient_name: ingredient.ingredientName,
    });

    ingredients_list.push({
      ingredient: ingredientData[0]._id,
      unit: ingredient.unit,
      quantity: ingredient.quantity,
    });
  }

  req.body.ingredientsList = ingredients_list;
  next();
};

exports.getGroceryList = async (req, res, next) => {
  const userId = req.query.userId;
  const groceryList = await GroceryList.find({ user: userId, active: true });
  res.json(groceryList);
};

exports.updateGroceryList = async (req, res, next) => {
  await GroceryList.findByIdAndUpdate(
    { _id: req.params.id },
    { list_items: req.body }
  );
  res.send("ok");
};

exports.confirmGroceryList = async (req, res, next) => {
  const groceryList = await GroceryList.findByIdAndUpdate(
    { _id: req.params.id },
    { finished_shopping: true }
  );

  var fridge_items = [];
  var fridge = await Fridge.findOne({ user: groceryList.user });
  if (fridge) fridge_items = fridge.fridge_items;
  else {
    fridge = await Fridge.create({
      user: groceryList.user,
      fridge_items: [],
    });
  }

  for (var list_item of groceryList.list_items) {
    var new_ingredient = {
      ingredient: list_item.ingredient._id,
      quantity: list_item.quantity,
    };

    var existing_fridge_item_category = fridge_items.filter(
      (x) => x.category == list_item.ingredient.category
    )[0];

    if (existing_fridge_item_category) {
      var existing_ingredient =
        existing_fridge_item_category.ingredients_list.filter((y) => {
          return String(y.ingredient._id) == String(list_item.ingredient._id);
        })[0];

      if (existing_ingredient) {
        existing_ingredient.quantity += list_item.quantity;
      } else {
        existing_fridge_item_category.ingredients_list.push(new_ingredient);
      }
    } else
      fridge_items.push({
        category: list_item.ingredient.category,
        ingredients_list: [new_ingredient],
      });
  }

  var final = await Fridge.findByIdAndUpdate(
    { _id: fridge._id },
    { fridge_items: fridge_items }
  );

  res.json(final);
};

exports.getFridge = async (req, res, next) => {
  const userId = req.query.userId;

  const userFridge = await Fridge.find({ user: userId });

  res.json(userFridge);
};

exports.updateFridge = async (req, res, next) => {
  var a = await Fridge.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        "fridge_items.$[elem].ingredients_list": req.body,
      },
    },
    { arrayFilters: [{ "elem.category": req.query.category }] }
  );

  res.json(a);
};

exports.addIngredient = async (req, res, next) => {
  const ingredient = await Ingredient.findById(req.body.newItem.ingredient);

  //check if exists
  const item = await Fridge.findById(
    { _id: req.params.id }
    // // {
    // //   $push: {
    // //     "fridge_items.$[elem].ingredients_list": req.body.newItem,
    // //   },
    // // },
    // { arrayFilters: [{ "elem.category": ingredient.category }] }
  );

  // const itemExists = item.filter(x => x.fridge_items.category == igrendient.category).filter(y => )

  // const data = await Fridge.findOneAndUpdate(
  //   { _id: req.params.id },
  //   {
  //     $push: {
  //       "fridge_items.$[elem].ingredients_list": req.body.newItem,
  //     },
  //   },
  //   { arrayFilters: [{ "elem.category": ingredient.category }] }
  // );

  res.json(item);
};
exports.removeIngredient = async (req, res, next) => {
  var a = "a";
  // await Fridge.findOneAndUpdate(
  //   { _id: req.params.id },
  //   {
  //     $set: {
  //       "fridge_items.$[elem].ingredients_list": req.body,
  //     },
  //   },
  //   { arrayFilters: [{ "elem.category": req.query.category }] }
  // );

  res.json(a);
};
