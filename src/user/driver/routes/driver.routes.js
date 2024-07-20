import { Router } from "express";
import { signUpDriver } from "../controller/signup.js";
import { upload } from "../../../core/middlewares/multer.js";
import { validateSignup } from "../validator/signup.validator.js";

const driverRouter = Router();

driverRouter.post("/signup", upload.single("workID"),validateSignup, signUpDriver);

export default driverRouter;
