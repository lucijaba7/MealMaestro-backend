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
    },
  ],
});

const Fridge = mongoose.model("Fridge", fridgeSchema);

module.exports = Fridge;
