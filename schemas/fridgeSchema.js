const mongoose = require("mongoose");

const fridgeSchema = new mongoose.Schema({
  user: {
    // jos treba vidit ovo...
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  fridge_items: [
    {
      category: {
        type: String,
        required: true,
      },
      ingredients_list: [
        {
          ingredient: {
            type: mongoose.Schema.ObjectId,
            ref: "Ingredient",
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

fridgeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "fridge_items.ingredients_list.ingredient",
  });
  next();
});

const Fridge = mongoose.model("Fridge", fridgeSchema);

module.exports = Fridge;
