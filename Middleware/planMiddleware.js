const WeeklyPlan = require("../schemas/weeklyPlanSchema");
const User = require("../schemas/userSchema");
const Recipe = require("../schemas/recipeSchema");

exports.getWeeklyPlan = (req, res, next) => {
  //   console.log(req.query);
  //   res.send(req.query);

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
  //Get user preferences
  const user_id = req.query.userId;
  const userData = await User.findById(user_id);
  const preferences = userData.preferences;

  var dailyMeals = [];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  for (var day of days) {
    dailyMeals.push({ day: day, daily_plan: [] });
  }

  for (var meal of ["Breakfast", "Lunch", "Snack", "Dinner", "Dessert"]) {
    var saved_recipes = [];

    var meals = await Recipe.find({
      meal_type: meal,
      tags: { $all: preferences },
    });

    for (var index in days) {
      var chosen_recipe;

      if (meals.length) {
        var i = Math.floor(Math.random() * meals.length);
        chosen_recipe = meals[i];
        saved_recipes.push(meals.splice(i, 1)[0]);
      } else if (day == "Monday")
        //kao..nije nasao ni jedan
        console.log("aaaaaaaaa fak");
      else {
        var i = Math.floor(Math.random() * saved_recipes.length);
        chosen_recipe = saved_recipes[i];
        // saved_recipe_ids.splice(index, 1);
      }

      dailyMeals[index].daily_plan.push({ recipe: chosen_recipe._id });
    }
  }

  var data = {
    user: user_id,
    servings: userData.servings,
    start_day: new Date(req.query.startDay),
    daily_meals: dailyMeals,
  };

  //   console.log(data);

  const weeklyPlan = await WeeklyPlan.create(data);
  res.json({ weeklyPlan });
};
