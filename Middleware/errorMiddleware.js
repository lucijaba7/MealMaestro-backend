import ErrorHandler from "../utils/errorHandler";

// const errorJWT = () => {
//   new ErrorHandler("Invalid token", 401);
// };

// const expiredErrorJWT = () => {
//   new ErrorHandler("Token expired", 401);
// };

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
