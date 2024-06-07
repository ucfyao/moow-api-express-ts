import { ValidationChain, body, param } from "express-validator";

const createUserValidatorSchema: ValidationChain[] = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const sendEmailValidatorSchema: ValidationChain[] = [
  body("email").trim().isEmail().notEmpty(),
  body("password").trim().isString().notEmpty(),
];

const verifyUserValidatorSchema: ValidationChain[] = [
  param("verifyCode")
    .trim()
    .notEmpty()
    .withMessage("Verification code is required"),
];

const getUserValidator: ValidationChain[] = [
  param("userId").trim().notEmpty().withMessage("User ID is required"),
];

const updateUserValidator: ValidationChain[] = [
  body("name").optional().trim().notEmpty().withMessage("Name is required"),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const updatePasswordValidator: ValidationChain[] = [
  param("userId").trim().notEmpty().withMessage("User ID is required"),
  body("OringalPassword")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Oringal password must be at least 6 characters long"),
  body("NewPassword")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("New assword must be at least 6 characters long"),
];

export default {
  createUserValidatorSchema,
  sendEmailValidatorSchema,
  verifyUserValidatorSchema,
  getUserValidator,
  updateUserValidator,
  updatePasswordValidator,
};
