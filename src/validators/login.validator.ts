import { ValidationChain, body, header } from "express-validator";

const createValidator: ValidationChain[] = [
  body("email").trim().isString().notEmpty(),
  body("password").trim().isString().notEmpty(),
];

const updateValidator: ValidationChain[] = [
  header("Authorization").trim().isString().notEmpty(),
];

const deleteValidator: ValidationChain[] = [
  header("Authorization").trim().isString().notEmpty(),
];

export default { createValidator, updateValidator, deleteValidator };
