const WeeklyPlan = require("../schemas/weeklyPlanSchema");
const DailyPlan = require("../schemas/dailyPlanSchema");
const User = require("../schemas/userSchema");
const Recipe = require("../schemas/recipeSchema");
const Ingredient = require("../schemas/ingredientSchema");
const GroceryList = require("../schemas/groceryListSchema");

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealTypes = ["Breakfast", "Lunch", "Snack", "Dinner", "Dessert"];

exports.getWeeklyPlan = (req, res, next) => {
  WeeklyPlan.findOne({
    user: req.query.userId,
    start_day: new Date(req.query.startDay),
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => console.log(err));
};

exports.createWeeklyPlan = async (req, res, next) => {
  const userData = await User.findById(req.query.userId);
  const preferences = userData.preferences;

  var dailyMeals = [];

  for (var day of days) {
    dailyMeals.push({ day: day, meals: [] });
  }

  for (var meal of mealTypes) {
    var saved_recipes = [];

    // FUS nacin
    if (preferences.length) {
      var meals = await Recipe.find({
        meal_type: meal,
        tags: { $all: ["vegan"] },
      });
    } else {
      var meals = await Recipe.find({
        meal_type: meal,
      });
    }

    for (var index in days) {
      var chosen_recipe;

      if (meals.length) {
        var i = Math.floor(Math.random() * meals.length);
        chosen_recipe = meals[i];
        saved_recipes.push(meals.splice(i, 1)[0]);
      }
      //kao..nije nasao ni jedan
      // console.log("aaaaaaaaa fak");
      else {
        var i = Math.floor(Math.random() * saved_recipes.length);
        chosen_recipe = saved_recipes[i];
        // saved_recipe_ids.splice(index, 1);
      }

      dailyMeals[index].meals.push({ recipe: chosen_recipe._id });
    }
  }

  var daily_meals = await Promise.all(
    dailyMeals.map(async (plan) => {
      const dailyPlan = await DailyPlan.create(plan);
      return dailyPlan._id;
    })
  );

  const weeklyPlan = await WeeklyPlan.create({
    user: req.query.userId,
    start_day: new Date(req.query.startDay),
    daily_plans: daily_meals,
  });

  res.json(weeklyPlan);
};

exports.deleteMeal = async (req, res, next) => {
  const plan = await DailyPlan.updateOne(
    { _id: req.params.id },
    { $pull: { meals: { _id: req.query.mealPlanId } } }
  );

  res.json({ plan: plan });
};

exports.addMeal = async (req, res, next) => {
  const plan = await DailyPlan.updateOne(
    { _id: req.params.id },
    { $push: { meals: { recipe: req.query.recipeId } } }
  );

  res.json({ plan: plan });
};

function findUnit(ingredient, unit) {
  if (unit == "g") return 1;
  if (unit == "kg") return 1000;
  for (var key in ingredient) {
    if (
      ["pieceMeasurements", "liquidMeasurements", "cupMeasurements"].includes(
        key
      )
    ) {
      for (var measure of ingredient[key]) {
        if (measure.unit == unit) return measure.g_weight;
      }
    }
  }
  return 1;
}

exports.confirmPlan = async (req, res, next) => {
  await WeeklyPlan.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { confirmed: true } }
  );
  next();
};

exports.createGroceryList = async (req, res, next) => {
  const weeklyPlan = await WeeklyPlan.findById(req.params.id);

  /////////////////////////// TREBA VIDIT STA IMA U FRIDGEU

  var list_items = [];
  var ingredient_quantity = {};

  for (var daily_plan of weeklyPlan.daily_plans) {
    for (var meal of daily_plan.meals) {
      for (var ingredient of meal.recipe.ingredients_list) {
        const ingredient_id = ingredient.ingredient._id;
        const g_weight = findUnit(ingredient.ingredient, ingredient.unit);
        if (ingredient_quantity[ingredient_id]) {
          const new_value =
            ingredient_quantity[ingredient_id] + g_weight * ingredient.quantity;
          ingredient_quantity[ingredient_id] = new_value;
        } else
          ingredient_quantity[ingredient_id] = g_weight * ingredient.quantity;
      }
    }
  }
  for (var key in ingredient_quantity) {
    list_items.push({
      ingredient: key,
      quantity: Math.ceil(ingredient_quantity[key] / 10) * 10,
    });
  }

  ///Stavi da su sve ostale grocery lists od usera ne aktivne
  await GroceryList.updateMany(
    { user: weeklyPlan.user._id },
    { $set: { active: false } }
  );

  const groceryList = await GroceryList.create({
    user: weeklyPlan.user._id,
    list_items: list_items,
  });

  await WeeklyPlan.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { grocery_list: groceryList._id } }
  );

  res.json(groceryList);
};
