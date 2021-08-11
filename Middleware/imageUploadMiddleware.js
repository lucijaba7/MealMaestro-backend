const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

function upload(file) {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: "recipes",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
  });
}

module.exports = upload;
