import { Request, Response, NextFunction } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ErrorCodes, CustomError } from "../utils/errors/err.errors"; 
import logger from "../utils/loggerUtils";

// error middleware
//   this middleware will be called when there is an error in the business code
//   and return 200 OK with business error in JSON body
const errorMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error occured: ${error.message}`);
  res.status(StatusCodes.BAD_REQUEST).json({ //都是bad request吗
    code: error.code || ErrorCodes.Unknown.code, 
    message: error.message || ErrorCodes.Unknown.message,
  });
};

export default errorMiddleware;
