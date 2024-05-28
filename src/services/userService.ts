import { User, IUser } from "../models/userModel";
import { nanoid } from "nanoid";
import logger from "../utils/loggerUtils";
import { ErrorCodes } from "../utils/errors/err.errors";
import * as crypto from 'crypto';

export class UserService {
  constructor() {}

  public async createUser(profile: IUser): Promise<IUser | null> {
    // check if the user already exists
    let user = await User.findOne({ email: profile.email });
    if (user) {
      throw new Error("User already exists"); //这里丢出的error会放到哪里处理
    }

    // if not, create a new user
    profile.id = nanoid();
    profile.verified = false;
    profile.verificationCode = nanoid();
    profile.createdAt = new Date();
    profile.updatedAt = new Date();

    const pwdObj = await this._generatePassword(profile.password);
    profile.salt = pwdObj.salt;
    profile.password = pwdObj.password;
    // todo: add reference
    user = new User(profile);

    // save the user to the database
    await user.save();

    // get the user from the database
    user = await User.findOne(
      { email: profile.email },
      {
        _id: 0,
        __v: 0,
        password: 0,
        verificationCode: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    );
    return user;
  }

  public async sendEmail(email: string, password: string): Promise<void> {
    // get user by email？？ it should be sending user a verification code
    let user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }

    // check if the user's password is correct
    if (user.password !== password) {
      throw new Error("Password is incorrect");
    }

    // check if the user is verified
    if (user.verified) {
      return;
    }

    // TODO: send verification email
  }

  public async verifyUser(code: string): Promise<void> {
    // get user by verification code
    let user = await User.findOne({ verificationCode: code });
    if (!user) {
      throw new Error("User not found");
    }

    // verify the user
    if (user.verified) {
      return;
    }
    user.verified = true;

    // save the user to the database
    await user.save();
  }

  public async getUserById(id: string, guest: boolean = false): Promise<IUser | null> {
    // get user by id
    logger.info(`guest: ${guest}`);
    let user = await User.findOne(
      { id: id },
      guest
        ? {
            _id: 0,
            __v: 0,
            password: 0,
            verificationCode: 0,
            createdAt: 0,
            updatedAt: 0,
          }
        : {
            _id: 0,
            __v: 0,
            verificationCode: 0,
            createdAt: 0,
            updatedAt: 0,
          }
    );
    return user;
  }

  public async getAllUsers(guest: boolean = false): Promise<IUser[]> {
    // get all users
    logger.info(`guest: ${guest}`);
    let users = await User.find(
      {},
      guest
        ? {
            _id: 0,
            __v: 0,
            password: 0,
            verificationCode: 0,
            createdAt: 0,
            updatedAt: 0,
          }
        : {
            _id: 0,
            __v: 0,
            verificationCode: 0,
            createdAt: 0,
            updatedAt: 0,
          }
    );
    return users;
  }

  public async getByEmail( //这是用于登录的
    email: string, 
    guest: boolean = false
  ): Promise<IUser | null> {
    // get user by email
    let user = await User.findOne(
      { email: email },
      guest
        ? {
            _id: 0,
            __v: 0,
            password: 0,
            verificationCode: 0,
            createdAt: 0,
            updatedAt: 0,
          }
        : {
            _id: 0,
            __v: 0,
            verificationCode: 0,
            createdAt: 0,
            updatedAt: 0,
          }
    );
    return user;
  }

  public async updateUser(id: string, profile: IUser): Promise<IUser | null> {
    // get user by id
    let user = await User.findOne({ id: id });
    if (!user) {
      throw new Error("User not found");
    }

    // update the user
    user.name = profile.name ?? user.name;
    user.avatar = profile.avatar ?? user.avatar;
    user.updatedAt = new Date();

    // save the user to the database
    await user.save();

    // get the user from the database
    user = await User.findOne(
      { id: id },
      {
        _id: 0,
        __v: 0,
        password: 0,
        verificationCode: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    );
    return user;
  }

  public async updatePassword(id: string, OriginalPassword: string, NewPassword: string): Promise<IUser | null> {
    // get user by id
    let user = await User.findOne({ id: id });
    if (!user) {
      throw new Error("User not found");
    }

    // check whether old password matches
    const pwdObj = await this._comparePassword(user.salt, OriginalPassword);
    if (pwdObj.password !== user.password) {
      throw new Error ('Original password is not correct');
    }

    const newPwdObj = await this._generatePassword(NewPassword);
    user.salt = newPwdObj.salt;
    user.password = newPwdObj.password;

    // save the user to the database
    await user.save();

    // get the user from the database
    user = await User.findOne(
      { id: id },
      {
        _id: 0,
        __v: 0,
        password: 0,
        verificationCode: 0,
        createdAt: 0,
        updatedAt: 0,
      }
    );
    return user;
  }

  async _generatePassword(password: string): Promise<{ salt: string; password: string }> {
    const salt = crypto.randomBytes(32).toString('base64');
    const cryptoPassword = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha512');

    return {
      salt: salt,
      password: cryptoPassword.toString('base64')
    };
  }

  async _comparePassword(salt: string, password: string): Promise<{ password: string; salt: string }> {
    const cryptoPassword = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha512');
  
    return {
      password: cryptoPassword.toString('base64'),
      salt,
    };
  }

}
