// import express from "express";
import cors from "cors";
import ErrorHandler from "./utils/errorHandler";
import errorMiddleware from "./middleware/errorMiddleware";
import authMiddleware from "./middleware/authMiddleware";
import avatarRouter from "./routes/avatarRouter";
import ingredientRouter from "./routes/ingredientRouter";
import userRouter from "./routes/userRouter";
import recipeRouter from "./routes/recipeRouter";
import weeklyPlanRouter from "./routes/weeklyPlanRouter";
import groceryListRouter from "./routes/groceryListRouter";
import dailyPlanRouter from "./routes/dailyPlanRouter";
import fridgeRouter from "./routes/fridgeRouter";
import sendEmail from "./utils/email";
const cron = require("node-cron");
const express = require("express");
const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/avatars", avatarRouter);
app.use("/users", userRouter);
app.use(authMiddleware.protect);
app.use("/ingredients", ingredientRouter);
app.use("/recipes", recipeRouter);
app.use("/weeklyPlan", weeklyPlanRouter);
app.use("/dailyPlan", dailyPlanRouter);
app.use("/groceryList", groceryListRouter);
app.use("/fridge", fridgeRouter);

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorMiddleware);

cron.schedule(
  "0 9 * * Sunday",
  () => {
    sendEmail();
  },
  {
    scheduled: true,
    timezone: "Europe/Zagreb",
  }
);

module.exports = app;
