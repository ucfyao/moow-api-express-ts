import express, { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { LoginController } from "../controllers/login.controller";
import authenticateJWT from "../middlewares/auth.middleware";

const router = express.Router();
const loginController = (req: Request, res: Response) =>
  new LoginController(req, res);

// login
router.post(
  "/",
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await loginController(req, res).create();
    }
  )
);

// update login
router.patch(
  "/",
  authenticateJWT,
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
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await loginController(req, res).quit();
    }
  )
);

export default router;
