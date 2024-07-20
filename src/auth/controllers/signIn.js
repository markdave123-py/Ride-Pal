import { userService } from "../../user/services/index.js";
import { config } from "../../core/config/env.js";
import { sanitizeUser } from "../../core/common/sanitize.js";

class SignInService {
  constructor(
    dbAuth,
    tokenService,
    dbUser,
    refreshTokenExpTime = config.auth.refreshTokenExpTime
  ) {
    this.dbAuth = dbAuth;
    this.tokenService = tokenService;
    this.dbUser = dbUser;
    this.refreshTokenExpTime = refreshTokenExpTime;
  }

  /**
   * Handles user login, performs necessary validations, and generates tokens for authentication.
   *
   * @param {Request} req - The input request object.
   * @param {Response} res - The response object.
   * @returns {Promise<any>} The API response containing authentication tokens and user data.
   * @throws {UnAuthorizedError} Thrown if login credentials are invalid or user email is not verified.
   */
  signIn = async (req, res) => {
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
      type: user.userRole,
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

const signInService = new SignInService(Auth, tokenService, User);
export { signInService };
