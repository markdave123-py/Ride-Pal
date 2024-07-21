import { Router } from "express";
import { verifyUser } from "../controller/verifyUser.js";
import { authGuard } from "../../../auth/authGuard/currentUser.js";


const verifyRouter = Router();


// Route for verifying a user
verifyRouter.post("/verify-user",authGuard.guard, verifyUser);

export default verifyRouter;