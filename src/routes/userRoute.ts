import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/userController";
import authenticateJWT from "../middlewares/authMiddleware";
import userValidator from "../validators/userValidator";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();
const userController = (req: Request, res: Response) =>
  new UserController(req, res);

// create user (register)
router.post(
  "/",
  userValidator.createUserValidatorSchema, 
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).createUser();
    }
  )
);

// send verification email
router.post(
  "/verification",
  userValidator.sendEmailValidatorSchema,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).sendEmail();
    }
  )
);

// verify user email
router.get(
  "/verification/:verifyCode", // url在邮件页面里，用户点击就发送get请求。
  userValidator.verifyUserValidatorSchema,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).verifyUser();
    }
  )
);

// get user profile
router.get(
  "/:userId",
  authenticateJWT, 
  userValidator.getUserValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).getUserById();
    }
  )
);

// get all users' profile
router.get(
  "/",
  authenticateJWT, 
  userValidator.getUserValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).getAllUsers();
    }
  )
);

// update user profile
router.patch(
  "/",
  authenticateJWT,
  userValidator.updateUserValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).updateUser();
    }
  )
);

// update user password
router.patch(
  "/password/",
  authenticateJWT,
  userValidator.updatePasswordValidator,
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userController(req, res).updatePassword();
    }
  )
);
export default router;
