import { authRouter } from "../auth/routes/signIn";
import { HttpStatus } from "../core/utils/statuscodes";
import { userRouter } from "../user/routes/signup";
import { Router } from "express";
import { vmRouter } from "../vm/routes/vm.routes";
import { projectRouter } from "../projects/routes/createproject.route";
import { variantRouter } from "../vm/routes/variant.routes";

export const appRouter = Router();

appRouter.use("/auth", authRouter);

appRouter.use("/users", userRouter);

appRouter.use("/projects", projectRouter);

appRouter.use("/variants", variantRouter);

appRouter.use("/vm", vmRouter);

appRouter.get("/health", (_, res) => {
  res.status(HttpStatus.OK).json({
    message: "API is up and running!",
    version: "1.0",
  });
});
