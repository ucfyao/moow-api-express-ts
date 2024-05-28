import { createSecretKey } from "crypto";
import { v4 as uuidv4 } from "uuid";
import * as jose from "jose";
import logger from "../utils/loggerUtils";

const secretKey = createSecretKey(process.env.JWT_SECRET ?? "", "utf-8");

export class LoginService {
  constructor() {}

  public async create(id: string): Promise<string> {
    // generate new jwt
    const jwt = await this.generateToken(id);
    logger.info(`Token created for user: ${id}, jwt: ${jwt}`);
    return jwt;
  }

  public async update(jwt: string): Promise<string> {
    // verify jwt
    const { id, tk } = await this.verifyToken(jwt);

    // generate new jwt with the same id and tk
    const newJwt = await this.generateToken(id, tk);
    logger.info(`Token updated for user: ${id}, jwt: ${newJwt}`);
    return newJwt;
  }

  public async delete(id: string): Promise<void> {
    // DO NOTHING HERE
    // in the future, you can save the token to a database
    // so you can delete it by setting the expiration time
    logger.info(`Token deleted for user: ${id}`);
  }

  public async verify(jwt: string): Promise<string> {
    const { id, tk } = await this.verifyToken(jwt);
    logger.info(`Token verified for user: ${id}`);
    return id;
  }

  public async generateToken(id: string, tk: string = ""): Promise<string> {
    process.env.JWT_ISSUER = process.env.JWT_ISSUER ?? "MOOW";
    process.env.JWT_AUDIENCE = process.env.JWT_AUDIENCE ?? "WebApp";
    process.env.JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME ?? "3h";

    const jwt = await new jose.SignJWT({
      id: id,
      tk: tk || uuidv4(),
    }) // details to  encode in the token
      .setProtectedHeader({
        alg: "HS256",
      }) // algorithm
      .setIssuedAt()
      .setIssuer(process.env.JWT_ISSUER) // issuer with nullish coalescing operator
      .setAudience(process.env.JWT_AUDIENCE) // audience
      .setExpirationTime(process.env.JWT_EXPIRATION_TIME) // token expiration time, e.g., "1 day"
      .sign(secretKey); // secretKey generated from previous step
    return jwt;
  }

  public async verifyToken(jwt: string): Promise<{ id: string; tk: string }> {
    try {
      // verify token
      jwt = jwt.replace("Bearer ", "");
      const { payload, protectedHeader } = await jose.jwtVerify(
        jwt,
        secretKey,
        {
          issuer: process.env.JWT_ISSUER, // issuer
          audience: process.env.JWT_AUDIENCE, // audience
        }
      );

      return { id: payload.id as string, tk: payload.tk as string };
    } catch (error) {
      // jwt verification failed
      logger.warn(`JWT is invalid, error: ${error}`);
      if (error instanceof jose.errors.JWTExpired) {
        throw new Error("Token expired"); //
      }
      throw new Error("Unauthorized");
    }
  }
}
