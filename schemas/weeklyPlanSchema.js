const mongoose = require("mongoose");

const weeklyPlanSchema = new mongoose.Schema({
  user: {
    // jos treba vidit ovo... i trebam servings uhvatiti tu
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  servings: {
    type: Number,
    required: true,
  },
  start_day: {
    type: Date,
    required: true,
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
  daily_meals: [
    {
      day: {
        type: String,
        required: true,
      },
      daily_plan: [
        {
          recipe: {
            type: mongoose.Schema.ObjectId,
            ref: "Recipe",
          },
          cooked: {
            type: Boolean,
            required: true,
            default: false,
          },
        },
      ],
    },
  ],
  grocery_list: {
    type: mongoose.Schema.ObjectId,
    ref: "GroceryList",
  },
});

weeklyPlanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "daily_meals.daily_plan.recipe",
  });
  next();
});

const WeeklyPlan = mongoose.model("WeeklyPlan", weeklyPlanSchema);

module.exports = WeeklyPlan;
