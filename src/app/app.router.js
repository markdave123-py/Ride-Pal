import { HttpStatus } from "../core/utils/statuscodes.js";
import { Router } from "express";
import driverRouter from "../user/driver/routes/driver.routes.js";
import passengerRouter from "../user/passenger/routes/passenger.routes.js"
import verifyRouter from "../user/admin/routes/verify.js";

export const appRouter = Router();

appRouter.use("/driver", driverRouter);
appRouter.use("/passenger", passengerRouter);
appRouter.use("/admin", verifyRouter);

appRouter.get("/health", (_, res) => {
  res.status(HttpStatus.OK).json({
    message: "API is up and running!",
    version: "1.0",
  });
});
