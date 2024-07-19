import { tokenService, type TokenService } from "../services/token";
import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/utils/statuscodes";
import { UnAuthorizedError } from "../../core/errors/unAuthorizedError";
import { ForbiddenError } from "../../core/errors/forbiddenError";
import { type ITokenSignedPayload } from "../../core/global/interface";
import { config } from "../../core/config/env";
import { AppMessages } from "../../core/common/appmessages";




class AuthGuard{
    constructor(private readonly tokenService: TokenService) { }

    guard = async (req: Request, res: Response, next: NextFunction) => {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                code: HttpStatus.UNAUTHORIZED,
                message: "Authorization header is required",
            });
        }
        const token = authHeader!.split(" ")[1];

        if (!token) {
            res.status(HttpStatus.UNAUTHORIZED).json({
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
            req.user = user as ITokenSignedPayload;
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
                  message: "Forbidden, you cant access this endpoint",
                });
            }

        }



    }


}



export const authGuard = new AuthGuard(tokenService);