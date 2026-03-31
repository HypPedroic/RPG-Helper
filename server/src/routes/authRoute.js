import * as authControllers from "../controllers/authController.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", authControllers.loginUser);
authRouter.post("/register", authControllers.registerUser);

export default authRouter;