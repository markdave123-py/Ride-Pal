import jwt, { JwtPayload, TokenExpiredError }  from "jsonwebtoken";
import { config } from "../../core/config/env";
import { Encryptor, encryptor } from "../../auth/services/encryptor";
import { type ITokenSignedPayload } from "../../core/global/interface";
import { logger } from "../../core/loggers";
import { UnAuthorizedError } from "../../core/errors/unAuthorizedError";
import { AppMessages } from "../../core/common/appmessages";
import { ForbiddenError } from "../../core/errors/forbiddenError";

export class TokenService {
  constructor(private readonly encryptor: Encryptor) {}

  async getTokens(data: ITokenSignedPayload): Promise<string[]> {
    return await Promise.all([
      this.generateAccessToken(data),
      this.generateRefreshToken(data),
    ]);
  }

  private generateToken = ({
    data,
    secret,
    expiresIn,
  }: {
    data: ITokenSignedPayload;
    secret: string;
    expiresIn: string;
  }) => {
    return jwt.sign(data, secret, { expiresIn });
  };

  async extractTokenDetails(encryptedToken: string, secret: string) {
    const token = this.encryptor.decrypt(encryptedToken);

      const tokenDetails = this.verifyToken(token, secret);

      let tokenPayload = tokenDetails as ITokenSignedPayload;

      return tokenPayload;
  }

  verifyToken(token: string, secret: string): JwtPayload {
    try {

      return jwt.verify(token, secret) as jwt.JwtPayload;

    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error("token expired");
        throw new UnAuthorizedError(AppMessages.FAILURE.TOKEN_EXPIRED);
      } else {
        logger.error(error);
        throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED);
      }


    }
  }

  private generateAccessToken = (data: ITokenSignedPayload): string => {
    const { accessTokenExpTime, accessTokenSecret } = config.auth;

    const accessToken = this.generateToken({
      data,
      secret: accessTokenSecret,
      expiresIn: accessTokenExpTime,
    });

    return this.encryptor.encrypt(accessToken);
  };

  private generateRefreshToken = (data: ITokenSignedPayload): string => {
    const { refreshTokenExpTime, refreshTokenSecret } = config.auth;

    const refreshToken = this.generateToken({
      data,
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpTime,
    });

    return this.encryptor.encrypt(refreshToken);
  };
}

export const tokenService = new TokenService(encryptor);
