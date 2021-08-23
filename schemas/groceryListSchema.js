const mongoose = require("mongoose");

const groceryListSchema = new mongoose.Schema({
  user: {
    // jos treba vidit ovo... i trebam servings uhvatiti tu
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  finished_shopping: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  list_items: [
    {
      bought: {
        type: Boolean,
        default: false,
      },
      ingredient: {
        type: mongoose.Schema.ObjectId,
        ref: "Ingredient",
      },
      // unit: {
      //   type: String,
      //   required: true,
      // },
      quantity: {
        type: Number,
        required: true,
      },
      required_quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

groceryListSchema.pre(/^find/, function (next) {
  this.populate({
    path: "list_items.ingredient",
  });
  next();
});

const GroceryList = mongoose.model("GroceryList", groceryListSchema);

module.exports = GroceryList;
