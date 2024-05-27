import { User, IUser } from "../models/user.model";
import { nanoid } from "nanoid";
import logger from "../utils/logger.utils";
import { ErrorCodes } from "../utils/errors/err.errors";

export class UserService {
  constructor() {}

  public async create(profile: IUser): Promise<IUser | null> {
    // check if the user already exists
    let user = await User.findOne({ email: profile.email });
    if (user) {
      throw new Error("User already exists");
    }

    // if not, create a new user
    profile.id = nanoid();
    profile.verified = false;
    profile.verificationCode = nanoid();
    profile.createdAt = new Date();
    profile.updatedAt = new Date();
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

  public async send(email: string, password: string): Promise<void> {
    // get user by email
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

  public async verify(code: string): Promise<void> {
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

  public async get(id: string, guest: boolean = false): Promise<IUser | null> {
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

  public async getByEmail(
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

  public async update(id: string, profile: IUser): Promise<IUser | null> {
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
}
