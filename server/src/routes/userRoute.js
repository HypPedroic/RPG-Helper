import { Router } from "express";
import * as userControllers from "../controllers/userController.js";
import ensureAuthenticated from "../middleware/ensureAutheticated.js";

const userRouter = Router();

userRouter.get("/users", userControllers.listAllUsers);
userRouter.get("/users/me", ensureAuthenticated, userControllers.getUserById);
userRouter.get("/users/by-email", ensureAuthenticated, userControllers.getUserByEmail);
userRouter.post("/users", ensureAuthenticated, userControllers.createUser);
userRouter.delete("/users/:userId", ensureAuthenticated, userControllers.deleteUser);
userRouter.put("/users/:userId", ensureAuthenticated, userControllers.updateUser);

export default userRouter;