app.get("/plan/daily", (req, res) => {
  let username = req.query.username;
  let startDay = req.query.startDay;
  let weekDay = req.query.weekDay;

  console.log(startDay);

  // ovo ce radit Mongo
  let plan = data.weekly_plan.filter(
    (x) => x.username == username && x.start_day == startDay
  );
  let dailyPlan = plan[0].daily_meal.filter((el) => el.day == weekDay); // + Mongo mora dohvatit bas recepte, a  ja sam samo array sa id-jevima recepta

  res.json(dailyPlan);
});

app.get("/plan/weekly", (req, res) => {
  let username = req.query.username;
  let startDay = req.query.startDay;

  // ovo ce radit Mongo
  let weeklyPlan = data.weekly_plan.filter(
    (x) => x.username == username && x.start_day == startDay
  );

  res.json(weeklyPlan[0].daily_meal);
});
