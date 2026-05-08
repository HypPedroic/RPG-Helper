import * as authControllers from "../controllers/authController.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", authControllers.loginUser);
authRouter.post("/register", authControllers.registerUser);
authRouter.get("/email-availability/:email", authControllers.checkEmailExists);
authRouter.get("/nickname-availability/:nickname", authControllers.checkNicknameExists);

export default authRouter;