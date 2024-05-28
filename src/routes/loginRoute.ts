import express, { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { LoginController } from "../controllers/loginController";
import authenticateJWT from "../middlewares/authMiddleware";
import loginValidator from "../validators/loginValidator";

const router = express.Router();
const loginController = (req: Request, res: Response) =>
  new LoginController(req, res);

// login
router.post(
  "/",
  loginValidator.createValidator, 
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await loginController(req, res).login();
    }
  )
);

// refresh login, this is used to extend the expiration time of the JWT
router.patch(
  "/",
  authenticateJWT, 
  loginValidator.updateValidator, //这里的错误去哪
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

// get captcha
router.get(
  '/captcha',
  authenticateJWT,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await loginController(req, res).getCaptcha();
    }
  )
);

export default router;
