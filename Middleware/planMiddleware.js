const WeeklyPlan = require("../schemas/weeklyPlanSchema");
const DailyPlan = require("../schemas/dailyPlanSchema");
const User = require("../schemas/userSchema");
const Recipe = require("../schemas/recipeSchema");

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
    user: user_id,
    start_day: new Date(req.query.startDay),
    daily_plans: daily_meals,
  });

  res.json({ weeklyPlan });
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
