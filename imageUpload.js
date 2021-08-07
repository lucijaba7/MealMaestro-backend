const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cloudinary = require("cloudinary").v2;
console.log(cloudinary.config().cloud_name);

cloudinary.uploader
  .upload("./avatar1.png", {
    resource_type: "image",
  })
  .then((result) => {
    console.log("succes");
  })
  .catch((error) => {
    console.log(error);
  });
