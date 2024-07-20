import User from "../../model/user.js";
import { InternalServerError } from "../../../core/errors/internalServerError.js";
import { RouteNotFoundError } from "../../../core/errors/notFoundError.js";
import { BadRequestError } from "../../../core/errors/BadRequestError.js";
import { ApiError } from "../../../core/errors/apiErrors.js";
import { logger } from "../../../core/loggers/logger.js";

export const verifyUser = async (req, res, next) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      throw new BadRequestError("userId required");
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new RouteNotFoundError("User not found");
    }

    user.is_verified = true;

    await user.save();

    logger.info(`User with id ${userId} verified successfully`);

    res.status(200).json({ message: "User verified successfully", user });
  } catch (error) {
    next(error instanceof ApiError ? error : new InternalServerError(error.message));
  }
};
