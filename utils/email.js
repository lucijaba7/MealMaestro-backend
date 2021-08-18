import nodemailer from "nodemailer";
import moment from "moment";
const User = require("../schemas/userSchema");

const sendEmail = async () => {
  let result = await User.find().select(["-_id", "-avatar", "email"]);
  let allEmails = result.map((el) => el.email);

  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.verify((err, success) => {
    if (err) console.error(err);
    console.log("Your config is correct");
  });

  // 2) Define the email options
  const saturdayDate = new Date();
  const mondayDate = moment(
    new Date(saturdayDate.getTime() + 24 * 60 * 60 * 1000)
  ).format("YYYY-MM-DD");

  const emailOptions = {
    from: "MealMaestro <mealMaestro@team.io>",
    to: allEmails,
    subject: "New weekly plan",
    html:
      "<div style='text-align: center'><h2><b>Hi there!</b></h2><p>It’s time to prepare for next week , please don't forget to generate your weekly plan.</p><p>Your MealMaestro</p> <img src='https://res.cloudinary.com/dtpfiawe9/image/upload/v1629222886/logo_xqyc36.png'><br> <br><a href='http://localhost:8080/plan/weekly?startDay=" +
      mondayDate +
      "'>Go to MealMaestro</a></div>",
  };

  // 3) Actually send the email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
