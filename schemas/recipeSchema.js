const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  meal_type: {
    type: String,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  total_time: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  ingredients_list: [
    {
      ingredient: {
        type: mongoose.Schema.ObjectId,
        ref: "Ingredient",
      },
      unit: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  directions: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  date_created: {
    type: String,
    required: true,
  },
  ratings: [
    {
      rate: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
  ],
});

recipeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "ingredients_list.ingredient",
  });
  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
