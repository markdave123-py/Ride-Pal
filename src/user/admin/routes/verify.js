import { Router } from "express";
import { verifyUser } from "../controller/verifyUser.js";


const verifyRouter = Router();


// Route for verifying a user
verifyRouter.post("/verify-user", verifyUser);

export default verifyRouter;