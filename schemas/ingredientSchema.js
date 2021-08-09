const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  ingredient_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  pieceMeasurements: {
    type: Array,
    required: false,
  },
  cupMeasurements: {
    type: Array,
    required: false,
  },
  liquidMeasurements: {
    type: Array,
    required: false,
  },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
