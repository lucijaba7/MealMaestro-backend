const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  _id: {
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

const Ingredient = mongoose.model("ingredient", ingredientSchema);

module.exports = Ingredient;
