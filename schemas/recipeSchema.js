const mongoose = require("mongoose");
//const Ingredient = require("./ingredientSchema");

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
});

recipeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "ingredients_list.ingredient",
    select: "ingredient_name",
  });
  next();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
