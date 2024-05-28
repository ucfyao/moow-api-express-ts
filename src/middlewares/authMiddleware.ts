import { Request, Response, NextFunction } from "express";
import constants from "../constants";
import logger from "../utils/loggerUtils";
import { LoginService } from "../services/loginService";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { ErrorCodes } from "../utils/errors/err.errors";

const login = new LoginService();

const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === constants.NODE_ENV_DEV) {
    return next();
  }

  // verify JWT
  try {
    let jwt = req.headers.authorization || ""; //登录后才有jwt？ 理解http协议
    if (jwt === "") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ code: ErrorCodes.Unauthorized.code, message: ErrorCodes.Unauthorized.message });
    }
    req.ctx.userId = await login.verify(jwt);
    next();
  } catch (error) {
    logger.warn(
      `rid: ${req.ctx.reqId}, userId: ${req.ctx.userId}, verify JWT failed - Unauthorized`
    );
    next(error); //这个error传哪， errormiddleware
  }
};

export default authenticateJWT;
