import { Request, Response, NextFunction } from "express";
import Context from "../utils/contextUtils";
import { v4 as uuidv4 } from "uuid";

const contextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.ctx = new Context( 
    Context.withReqId(req.header("X-Request-Id") || uuidv4()) //自定义上下文容器
  );

  next();
};

export default contextMiddleware;
