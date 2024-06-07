import { CustomError } from "../errors";
import { Context } from "../services";

export {};

declare global {
  namespace Express {
    export interface Response {
      success: (data?: any) => void;
      fail: (err?: CustomError, httpCode?: number) => void;
    }
    export interface Request {
      ctx: Context;
    }
  }
}
