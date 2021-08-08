const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
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
  ingredients_list: {
    type: Array,
    required: true,
  },
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

const Recipe = mongoose.model("recipe", recipeSchema);

module.exports = Recipe;
