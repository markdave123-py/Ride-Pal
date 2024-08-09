import { Router } from "express";
import { signUpDriver } from "../controller/signup.js";
import { upload } from "../../../core/middlewares/multer.js";
import { validateSignup } from "../validator/signup.validator.js";
import { getVehicle } from "../controller/getVehicle.js";
import { validateGetVehicle } from "../validator/getVehicle.validator.js";

const driverRouter = Router();

driverRouter.post(
  "/signup",
  upload.single("workID"),
  validateSignup,
 signUpDriver
)

driverRouter.post("get-vechile", validateGetVehicle, getVehicle)


export default driverRouter;
