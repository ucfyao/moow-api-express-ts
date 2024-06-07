import { ValidationChain, body, header } from "express-validator";

const createValidator: ValidationChain[] = [
  body("email").trim().isString().notEmpty(),
  body("password").trim().isString().isLength({ min: 6 }).notEmpty(),
];

const updateValidator: ValidationChain[] = [
  header("Authorization").trim().isString().notEmpty(),
];

const deleteValidator: ValidationChain[] = [
  header("Authorization").trim().isString().notEmpty(),
];

export default { createValidator, updateValidator, deleteValidator };
