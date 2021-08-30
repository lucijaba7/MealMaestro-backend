import ErrorHandler from "../utils/errorHandler";

const errorJWT = () => {
  new ErrorHandler("Invalid token", 401);
};

const expiredErrorJWT = () => {
  new ErrorHandler("Token expired", 401);
};

const duplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  return new ErrorHandler(`Duplicate field value: ${value}.`, 400);
};

const validationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new ErrorHandler(`Invalid data. ${errors.join(". ")}`, 400);
};

const castErrorDB = (err) => {
  return new ErrorHandler(`Invalid ${err.path}: ${err.value}`, 400);
};

const sendError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err);
  let error = { ...err };
  console.log(error);
  if (error.name === "JsonWebTokenError") error = errorJWT();
  if (error.name === "TokenExpiredError") error = expiredErrorJWT();
  if (error.name === 11000) error = duplicateErrorDB(error);
  if (error.name === "ValidationError") error = validationErrorDB(error);
  if (error.name === "CastError") error = castErrorDB(error);
  if (!error.message) error.message = err.message;
  sendError(error, res);
};
