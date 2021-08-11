const mongoose = require("mongoose");

const groceryListSchema = new mongoose.Schema({
  user: {
    // jos treba vidit ovo... i trebam servings uhvatiti tu
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  finished_shopping: {
    type: Boolean,
    required: true,
  },
  list_items: [
    {
      bought: {
        type: Boolean,
        required: true,
      },
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
});

const GroceryList = mongoose.model("GroceryList", groceryListSchema);

module.exports = GroceryList;
