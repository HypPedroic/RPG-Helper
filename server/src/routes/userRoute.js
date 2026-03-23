import { Router } from "express";
import * as userControllers from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/users", userControllers.listAllUsers);
userRouter.get("/users/:id", userControllers.getUserById);
userRouter.post("/login", userControllers.loginUser);
userRouter.post("/register", userControllers.createUser);
userRouter.delete("/users/delete/:id", userControllers.deleteUser);
userRouter.put("/users/update/:id", userControllers.updateUser);

export default userRouter;