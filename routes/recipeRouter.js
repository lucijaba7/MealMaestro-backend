app.get("/recipes/:category", (req, res) => {
  let category = req.params.category;
  let username = req.query.username;

  // ovo ce radit Mongo
  let recipes = data.recipes.filter((x) => x.username == username);
  let fridge_items = fridge[0].fridge_items.filter(
    (x) => x.category == category
  );

  res.json(fridge_items);
});

app.post("/recipes", (req, res) => {
  let doc = req.body;
  console.log(doc.image);
  // data.recipes.push(doc)
  // console.log(data.recipes)
  res.json({ status: "ok" });
});
