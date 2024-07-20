import { tokenService } from "../services/token";
import { HttpStatus } from "../../core/utils/statuscodes";
import { UnAuthorizedError } from "../../core/errors/unAuthorizedError";
import { ForbiddenError } from "../../core/errors/forbiddenError";
import { config } from "../../core/config/env";
import { AppMessages } from "../../core/common/appmessages";

class AuthGuard {
  constructor(tokenService) {
    this.tokenService = tokenService;
    this.guard = this.guard.bind(this);
  }

  async guard(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: "Authorization header is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: "Token is required",
      });
    }

    const { accessTokenSecret } = config.auth;

    try {
      const user = await this.tokenService.extractTokenDetails(
        token,
        accessTokenSecret
      );
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof UnAuthorizedError) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          code: HttpStatus.UNAUTHORIZED,
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.FORBIDDEN).json({
          code: HttpStatus.FORBIDDEN,
          message: "Forbidden, you can't access this endpoint",
        });
      }
    }
  }
}

const authGuard = new AuthGuard(tokenService);
export { authGuard };
