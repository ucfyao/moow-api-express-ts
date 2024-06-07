import { Request, Response } from "express";
import BaseController from "./baseController";
import { UserService } from "../services/userService";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/loggerUtils";
import { ErrorCodes } from "../utils/errors/err.errors";

export class UserController extends BaseController {
  constructor(req: Request, res: Response) {
    super(req, res);
  }

  // TODO: refactor this class
  public async createUser() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code); 
    }

    // business code
    let users = new UserService();
    const profile = await users.createUser(this.req.body);
    this.success({ profile }, StatusCodes.CREATED);
  }

  public async sendEmail() {
    let users = new UserService();
    await users.sendEmail(this.req.body.email, this.req.body.password);
    this.success({});
  }

  public async verifyUser() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // business code
    let users = new UserService();
    await users.verifyUser(this.req.params.verifyCode || "");
    this.success({});
  }

  public async getUserById() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // business code
    let users = new UserService();
    const profile = await users.getUserById(this.req.params.userId, true); //为什么跟update不一样
    this.success({ profile });
  }

  public async getAllUsers() {
    // check params: 这里需要check吗
      
    // business code
    let users = new UserService();
    const profile = await users.getAllUsers(true); 
    this.success({ profile });
  }

  public async updateUser() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // business code
    let users = new UserService();
    const profile = await users.updateUser(this.req.ctx.userId, this.req.body); //为什么跟getbyid不一样
    this.success({ profile });
  }

  public async updatePassword() {
    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // business code
    let users = new UserService();
    const profile = await users.updatePassword(this.req.ctx.userId, this.req.body.OriginalPassword, this.req.body.NewPassword); 
    this.success({ profile }); 
  }

}
