import express from "express";
import cors from "cors";
import ErrorHandler from "./utils/errorHandler";
import errorMiddleware from "./middleware/errorMiddleware";
import avatarRouter from "./routes/avatarRouter";
import ingredientRouter from "./routes/ingredientRouter";
import userRouter from "./routes/userRouter";
import recipeRouter from "./routes/recipeRouter";
import weeklyPlanRouter from "./routes/weeklyPlanRouter";
import sendEmail from "./utils/email";
const cron = require("node-cron");

const app = express(); // instanciranje aplikacije

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/avatars", avatarRouter);
app.use("/ingredients", ingredientRouter);
app.use("/users", userRouter);
app.use("/recipes", recipeRouter);
app.use("/weeklyPlan", weeklyPlanRouter);

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorMiddleware);

// nezz ako je ispravno da to tu bude
cron.schedule(
  "0 9 * * Sunday", // nedjelja 9 ujutro
  () => {
    console.log("sending");
    sendEmail();
  },
  {
    scheduled: true,
    timezone: "Europe/Zagreb",
  }
);

module.exports = app;
