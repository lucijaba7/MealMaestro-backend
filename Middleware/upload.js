const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// let mongoURI =
//   "mongodb+srv://lucijaba7:2CfHrh1ToLuQiJFC@cluster0.dove2.mongodb.net/MealMaestro?retryWrites=true&w=majority";
const storage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      return file.originalname;
    }

    return {
      bucketName: "recipes",
      filename: file.originalname,
    };
  },
});

module.exports = multer({ storage });
