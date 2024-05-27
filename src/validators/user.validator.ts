import { ValidationChain, body, param } from "express-validator";

const createValidator: ValidationChain[] = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const sendValidator: ValidationChain[] = [
  body("email").trim().isEmail().notEmpty(),
  body("password").trim().isString().notEmpty(),
];

const verifyValidator: ValidationChain[] = [
  param("verifyCode")
    .trim()
    .notEmpty()
    .withMessage("Verification code is required"),
];

const getValidator: ValidationChain[] = [
  param("userId").trim().notEmpty().withMessage("User ID is required"),
];

const updateValidator: ValidationChain[] = [
  body("name").optional().trim().notEmpty().withMessage("Name is required"),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export default {
  createValidator,
  sendValidator,
  verifyValidator,
  getValidator,
  updateValidator,
};
