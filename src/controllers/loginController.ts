import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BaseController from "./baseController";
import { UserService } from "../services/userService";
import { LoginService } from "../services/loginService";
import logger from "../utils/loggerUtils";
import { ErrorCodes } from "../utils/errors/err.errors";
import * as svgCaptcha from 'svg-captcha';
import constants from "../constants";

interface CaptchaOptions {
  width?: number;
  height?: number;
  fontSize?: number;
  backgroundColor?: string;
}

export class LoginController extends BaseController {
  constructor(req: Request, res: Response) {
    super(req, res);
  }

  // TODO: refactor this class
  public async login() {
    // check captcha
    if(!this.captchaIsValid()){
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // check params
    if (!this.validate()) {
      return this.fail(StatusCodes.BAD_REQUEST, ErrorCodes.ParamsInvalid.code);
    }

    // get user info from database
    let users = new UserService();
    const user = await users.getByEmail(this.req.body.email); //返回邮箱或者密码
    if (!user) {
      logger.warn(`user not found: ${this.req.body.email}`);
      return this.fail(StatusCodes.NOT_FOUND, ErrorCodes.NotFound.code);
    }

    // check whether old password matche
    const pwdObj = await users._comparePassword(user.salt, user.password);
    if (pwdObj.password !== user.password) {
      logger.warn(`Password is not correct}`);
      return this.fail(StatusCodes.UNAUTHORIZED, ErrorCodes.AuthFailed.code);  
    }

    // create JWT
    let login = new LoginService();
    const token = await login.create(user.id);
    this.success({ token }); // 只是放回respond的body的data里吗？那req.ctx.id
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
  
  public async getCaptcha(): Promise<void> {
    // Extract query parameters or use default values for captcha configuration
    const {
      width = 150,
      height = 36,
      fontSize = 50,
      backgroundColor = '#f5f5f5',
    } = this.req.query as CaptchaOptions;
  
    // Set captcha options
    svgCaptcha.options.width = width;
    svgCaptcha.options.height = height;
    svgCaptcha.options.fontSize = fontSize;
  
    // Create a math expression captcha
    const captcha = svgCaptcha.createMathExpr({
      size: 4, // Length of the captcha
      ignoreChars: '0o1i', // Characters to exclude from the captcha
      noise: 3, // Number of noise lines
      color: true, // Whether the captcha characters have color (default: no color)
      background: backgroundColor, // Background color of the captcha image
    });

    // Store the captcha text in the session for later verification
    this.req.ctx.session = captcha.text; // here's different from old version because they use session

    // Set the response content type to SVG and send the captcha image
    this.res.type('image/svg+xml');
    this.res.send(captcha.data);
  }

  public async captchaIsValid() {
    if (process.env.NODE_ENV === constants.NODE_ENV_DEV && this.req.body.captcha === "888") {
      return true;
    }
    return this.req.ctx.captcha === this.req.body.captcha;
  }

}
