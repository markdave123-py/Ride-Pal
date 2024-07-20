import { signInService } from "../controllers/signIn";
import { Router } from "express";


export const authRouter = Router();

authRouter.post("/signin", signInService.signIn);