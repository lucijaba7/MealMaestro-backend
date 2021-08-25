const mongoose = require("mongoose");

const weeklyPlanSchema = new mongoose.Schema({
  user: {
    // jos treba vidit ovo... i trebam servings uhvatiti tu
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  start_day: {
    type: Date,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  daily_plans: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "DailyPlan",
    },
  ],
  grocery_list: {
    type: mongoose.Schema.ObjectId,
    ref: "GroceryList",
  },
});

weeklyPlanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "daily_plans",
  });
  next();
});
weeklyPlanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "grocery_list",
  });
  next();
});

const WeeklyPlan = mongoose.model("WeeklyPlan", weeklyPlanSchema);

module.exports = WeeklyPlan;
