import { Request, Response } from "express";
import BaseController from "./base.controller";
import { UserService } from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.utils";
import { ErrorCodes } from "../utils/errors/err.errors";

export class UserController extends BaseController {
  constructor(req: Request, res: Response) {
    super(req, res);
  }

  // TODO: refactor this class
  public async create() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // business code
    let users = new UserService();
    const profile = await users.create(this.req.body);
    this.success({ profile }, StatusCodes.CREATED);
  }

  public async send() {
    let users = new UserService();
    await users.send(this.req.body.email, this.req.body.password);
    this.success({});
  }

  public async verify() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // business code
    let users = new UserService();
    await users.verify(this.req.params.verifyCode || "");
    this.success({});
  }

  public async get() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // business code
    let users = new UserService();
    const profile = await users.get(this.req.params.userId, true);
    this.success({ profile });
  }

  public async update() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // business code
    let users = new UserService();
    const profile = await users.update(this.req.ctx.userId, this.req.body);
    this.success({ profile });
  }
}
