import { RideService } from "../services/ride.service.js";
import { InternalServerError } from "../../core/errors/internalServerError.js";
import { ApiError } from "../../core/errors/apiErrors.js";
import { ForbiddenError } from "../../core/errors/forbiddenError.js";
import { HttpStatus } from "../../core/utils/statuscodes.js";
import { BadRequestError } from "../../core/errors/BadRequestError.js";
import { ConflictError } from "../../core/errors/conflictError.js";
import { logger } from "../../core/loggers/logger.js";

export const joinRide = async (req, res, next) => {
  const { routeId } = req.body;

  try {

      const currUser = req.user;

      if (currUser.type !== "passenger") {
        return next(
          new ForbiddenError("Only passengers can access this route!!")
        );
      }

      const ride = await RideService.getRideByRouteId(routeId);

      if (!ride) {
        return next(new BadRequestError("No routes found"));
      }

    if(ride.status !==  "pending") return next(new ConflictError("You can only join rides that are pending/ jot started!!"))

      const joinedRide = await RideService.joinRide(ride, currUser.id);

      if (!joinedRide) return next(new ForbiddenError("you can't join this ride!!"));

      logger.info("Passenger successfully joined ride!!");
      return res.status(HttpStatus.OK).json({
        message: "Passenger successfully joined ride!!",
        joinedRide,
      });

  } catch (error) {

      next( error instanceof ApiError ? error : new InternalServerError(error.message))

  }
};
