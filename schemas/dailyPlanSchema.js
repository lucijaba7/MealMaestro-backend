const mongoose = require("mongoose");

const dailyPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  meals: [
    {
      recipe: {
        type: mongoose.Schema.ObjectId,
        ref: "Recipe",
      },
      cooked: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

dailyPlanSchema.pre(/^find/, function (next) {
  this.populate({
    path: "meals.recipe",
  });
  next();
});

const DailyPlan = mongoose.model("DailyPlan", dailyPlanSchema);

module.exports = DailyPlan;
