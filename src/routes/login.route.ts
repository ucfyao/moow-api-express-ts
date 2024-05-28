import express, { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { LoginController } from "../controllers/login.controller";
import authenticateJWT from "../middlewares/auth.middleware";
import loginValidator from "../validators/login.validator";

const router = express.Router();
const loginController = (req: Request, res: Response) =>
  new LoginController(req, res);

// login
router.post(
  "/",
  loginValidator.createValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await loginController(req, res).create();
    }
  )
);

// refresh login, this is used to extend the expiration time of the JWT
router.patch(
  "/",
  authenticateJWT,
  loginValidator.updateValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await loginController(req, res).update();
    }
  )
);

// quit login
router.delete(
  "/",
  authenticateJWT,
  loginValidator.deleteValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await loginController(req, res).quit();
    }
  )
);

export default router;
