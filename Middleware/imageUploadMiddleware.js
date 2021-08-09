// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
// console.log(cloudinary.config().cloud_name);

function upload(file) {
  let cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: "recipes",
    },
    function (error, result) {
      console.log(error, result);
      if (result) {
        return result.url;
      }
    }
  );

  streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);

  // cloudinary.uploader
  //   .upload_stream(file.upload.path, "recipes", {
  //     resource_type: "image",
  //   })
  //   .then((result) => {
  //     console.log(result);
  //     console.log("succes");
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
}

module.exports = upload;
