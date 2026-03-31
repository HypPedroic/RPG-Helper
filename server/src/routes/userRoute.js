import { Router } from "express";
import * as userControllers from "../controllers/userController.js";
import ensureAuthenticated from "../middleware/ensureAutheticated.js";

const userRouter = Router();

userRouter.get("/users", ensureAuthenticated, userControllers.listAllUsers);
userRouter.get("/profile", ensureAuthenticated, userControllers.getUserById);
userRouter.get("/users/email", ensureAuthenticated, userControllers.getUserByEmail);
userRouter.post("/users/create", ensureAuthenticated, userControllers.createUser);
userRouter.delete("/users/delete/:id", ensureAuthenticated, userControllers.deleteUser);
userRouter.put("/users/update/:id", ensureAuthenticated, userControllers.updateUser);

export default userRouter;