import AppError from "../utils/appError.js";
import { logEvents } from "./logEvents.js";

const handleDBCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value ${value}. Please use another`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((er) => er.message);
  const message = `Invalid input data: ${errors.join(".\n")}`;
  return new AppError(message, 400);
};

const handleTokenExpiredError = () => {
  return new AppError("Login expired!! Please login again", 401);
};

const handleInvalidTokenError = () => {
  return new AppError("Invalid Token!! Please login again", 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: err.status,
      message: "Oops something went wrong",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const errLog = `${err.status}\t${err.message}`;
  logEvents(errLog, "errLog.txt");

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err, Object.getOwnPropertyDescriptors(err));
    if (error.name === "CastError") error = handleDBCastError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "JsonWebTokenError") error = handleInvalidTokenError();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    sendErrorProd(error, res);
  }
  next();
};

export default globalErrorHandler;
