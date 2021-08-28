import asyncHandler from "../utils/asyncHandler";
import Fridge from "../schemas/fridgeSchema";
import GroceryList from "../schemas/groceryListSchema";
import Ingredient from "../schemas/ingredientSchema";

exports.getAllIngredients = asyncHandler(async (req, res, next) => {
  const ingredients = await Ingredient.find();
  res.send(ingredients);
});

exports.getIngredientsIdFromName = asyncHandler(async (req, res, next) => {
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
});

exports.getGroceryList = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const groceryList = await GroceryList.find({ user: userId, active: true });
  res.json(groceryList);
});

exports.updateGroceryList = asyncHandler(async (req, res, next) => {
  await GroceryList.findByIdAndUpdate(
    { _id: req.params.id },
    { list_items: req.body }
  );
  res.status(200).json({
    status: "succes",
    data: null,
  });
});

exports.confirmGroceryList = asyncHandler(async (req, res, next) => {
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

  res.status(200).json({
    status: "succes",
    data: null,
  });
});

exports.getFridge = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const userFridge = await Fridge.find({ user: userId });

  res.json(userFridge);
});

exports.createFridge = asyncHandler(async (req, res, next) => {
  const userFridge = await Fridge.create({
    user: req.user._id,
    fridge_items: [],
  });

  res.json(userFridge);
});

exports.updateFridge = asyncHandler(async (req, res, next) => {
  var fridge = await Fridge.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        "fridge_items.$[elem].ingredients_list": req.body,
      },
    },
    { arrayFilters: [{ "elem.category": req.query.category }] }
  );

  res.status(200).json({
    status: "succes",
    data: null,
  });
});

exports.addIngredient = asyncHandler(async (req, res, next) => {
  const ingredient = await Ingredient.findById(req.body.newItem.ingredient);
  const fridge = await Fridge.findById({ _id: req.params.id });

  var categoryExists = fridge.fridge_items.filter(
    (x) => x.category == ingredient.category
  )[0];

  if (categoryExists) {
    await Fridge.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          "fridge_items.$[elem].ingredients_list": req.body.newItem,
        },
      },
      { arrayFilters: [{ "elem.category": ingredient.category }] }
    );
  } else {
    var newObj = {
      category: ingredient.category,
      ingredients_list: [req.body.newItem],
    };
    await Fridge.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { fridge_items: newObj } }
    );
  }

  res.status(200).json({
    status: "succes",
    data: null,
  });
});
