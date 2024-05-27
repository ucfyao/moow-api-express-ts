import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import authenticateJWT from "../middlewares/auth.middleware";
import userValidator from "../validators/user.validator";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();
const userController = (req: Request, res: Response) =>
  new UserController(req, res);

// create user (register)
router.post(
  "/",
  userValidator.createValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).create();
    }
  )
);

// send verification email
router.post(
  "/verification",
  userValidator.sendValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).send();
    }
  )
);

// verify user email
router.get(
  "/verification/:verifyCode",
  userValidator.verifyValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).verify();
    }
  )
);

// get user profile
router.get(
  "/:userId",
  authenticateJWT,
  userValidator.getValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).get();
    }
  )
);

// update user profile
router.patch(
  "/",
  authenticateJWT,
  userValidator.updateValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).update();
    }
  )
);

export default router;
