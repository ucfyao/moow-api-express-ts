import { Request, Response, NextFunction } from "express";
import logger from "../utils/loggerUtils";

const accessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalJson = res.json;
  res.json = function (body: any): Response<any, Record<string, any>> {
    logger.info(
      `rid: ${req.ctx.reqId}, req: ${JSON.stringify(
        req.body
      )}, res: ${JSON.stringify(body)}`
    );
    return originalJson.call(this, body);
  };

  next();
};

export default accessMiddleware;
