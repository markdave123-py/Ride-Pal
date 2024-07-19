import { tokenService, type TokenService } from "../services/token";
import { AppMessages } from "../../core/common/appmessages";
import { logger } from "../../core/loggers";
import { Auth } from "../model/auth.model";
import { User } from "../../user/models/user.models";
import { HttpStatus } from "../../core/utils/statuscodes";
import { comparePassword } from "../../core/utils/bcrypt";
import { signInSchema } from "../validator/signin";
import { Request, Response } from "express";
import { UserService, userService } from "../../user/services";
import { config } from "../../core/config/env";
import { sanitizeUser } from "../../core/common/sanitize";

class SignInService {
  constructor(
    private readonly dbAuth: typeof Auth,
    private readonly tokenService: TokenService,
    private readonly dbUser: typeof User,
    // private readonly userService: userService,
    private readonly refreshTokenExpTime: string = config.auth
      .refreshTokenExpTime
  ) {}

  /**
   * Handles user login, performs necessary validations, and generates tokens for authentication.
   *
   * @param {SignInPayload} params - The input parameters for user login.
   * @returns {Promise<any>} The API response containing authentication tokens and user data.
   * @throws {UnAuthorizedError} Thrown if login credentials are invalid or user email is not verified.
   */

  signIn = async (req: Request, res: Response) => {
    const { error, value } = signInSchema.validate(req.body);

    if (error) {
      logger.error(error.details[0].message);
      return res.json({
        code: HttpStatus.BAD_REQUEST,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      logger.error(AppMessages.FAILURE.INVALID_CREDENTIALS);
      return res.json({
        code: HttpStatus.UNAUTHORIZED,
        message: AppMessages.FAILURE.INVALID_CREDENTIALS,
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      logger.error(AppMessages.FAILURE.INVALID_CREDENTIALS);
      return res.json({
        code: HttpStatus.UNAUTHORIZED,
        message: AppMessages.FAILURE.INVALID_CREDENTIALS,
      });
    }

    const [accessToken, refreshToken] = await this.tokenService.getTokens({
      id: user.id,
      email: user.email,
      type: user.userRole
    });

    let expireAt = new Date();
    expireAt.setSeconds(
      expireAt.getSeconds() +
        parseInt(this.refreshTokenExpTime.slice(0, -1)) * 60
    );

    await this.dbAuth.update(
      {
        refreshToken: refreshToken,
        refreshTokenExp: expireAt,
      },
      { where: { userId: user.id } }
    );

    logger.info(AppMessages.SUCCESS.LOGIN);

    return res.json({
      code: HttpStatus.OK,
      message: AppMessages.SUCCESS.LOGIN,
      data: {
        accessToken,
        refreshToken,
        user: sanitizeUser(user),
      },
    });
  };
}

export const signInService = new SignInService(
  Auth,
  tokenService,
  User,
);
