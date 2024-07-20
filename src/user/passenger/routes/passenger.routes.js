import { Router} from "express";
import { upload } from "../../../core/middlewares/multer.js";
import { validateSignup } from "../validator/signup.validator.js";
import { passengerSignup } from "../controller/signup.js";

const passengerRouter = Router();

// Route for passenger signup
passengerRouter.post(
  "/signup",
  upload.single("workID"),
  validateSignup,
  passengerSignup
);

export default passengerRouter;
