// app.get("/fridge/:category", (req, res) => {
//   let category = req.params.category;
//   category = category.charAt(0).toUpperCase() + category.slice(1);

//   let username = req.query.username;

//   // ovo ce radit Mongo
//   let fridge = data.fridge.filter((x) => x.username == username);
//   let fridge_items = fridge[0].fridge_items.filter(
//     (x) => x.category == category
//   );

//   res.json(fridge_items);
// });
