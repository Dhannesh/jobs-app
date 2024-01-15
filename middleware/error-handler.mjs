import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  let customeError = {
    msg: err.message || "Something went wrong try again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.name === "ValidationError") {
    customeError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customeError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    customeError.msg = `No item found with id: ${err.value}`;
    customeError.statusCode = StatusCodes.NOT_FOUND;
  }
  if (err.code && err.code === 11000) {
    customeError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, prease choose another value`;
    customeError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
  return res.status(customeError.statusCode).json({ msg: customeError.msg });
};

export default errorHandlerMiddleware;
