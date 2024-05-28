import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BaseController from "./base.controller";
import { UserService } from "../services/user.service";
import { LoginService } from "../services/login.service";
import logger from "../utils/logger.utils";
import { ErrorCodes } from "../utils/errors/err.errors";

export class LoginController extends BaseController {
  constructor(req: Request, res: Response) {
    super(req, res);
  }

  // TODO: refactor this class
  public async create() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // get user info from database
    let users = new UserService();
    const user = await users.getByEmail(this.req.body.email);
    if (!user) {
      logger.warn(`user not found: ${this.req.body.email}`);
      return this.fail(StatusCodes.NOT_FOUND, ErrorCodes.NotFound.code);
    }

    // TODO: password should be encrypted (md5/sha1(password + salt) or bcrypt)

    // verify password
    if (user.password !== this.req.body.password) {
      logger.warn(`password not match: ${this.req.body.email}`);
      return this.fail(StatusCodes.UNAUTHORIZED, ErrorCodes.AuthFailed.code);
    }

    // create JWT
    let login = new LoginService();
    const token = await login.create(user.id);
    this.success({ token });
  }

  public async update() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // get JWT
    let jwt = this.req.headers.authorization || "";

    // update JWT
    let login = new LoginService();
    const token = await login.update(jwt);

    // return new JWT
    this.success({ token });
  }

  public async quit() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }
    this.success({});
  }
}
