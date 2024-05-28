import { Request, Response } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ErrorCodes, getErrorReason } from "../utils/errors/err.errors";
import logger from "../utils/loggerUtils";

class BaseController {
  protected req: Request;
  protected res: Response;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  protected success(
    data: any,
    statusCode: number = StatusCodes.OK,
    message: string = ""
  ) {
    this.res.status(statusCode).json({
      code: ErrorCodes.Success.code,
      message:
        message || ErrorCodes.Success.message || getReasonPhrase(statusCode),
      data,
    });
  }

  protected fail(
    statusCode: number,
    errorCode: number,
    data: any = null,
    message: string = ""
  ) {
    this.res.status(statusCode).json({
      code: errorCode,
      message:
        message || getErrorReason(errorCode) || getReasonPhrase(statusCode),
      errorCode,
      data,
    });
  }

  protected validate(): boolean {
    if (!validationResult(this.req).isEmpty()) {
      logger.error(
        `validation error: ${JSON.stringify(
          validationResult(this.req).array()
        )}`
      );
      return false;
    }
    return true;
  }
}

export default BaseController;
