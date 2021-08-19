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
