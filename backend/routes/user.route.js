import {
  updateUser,
  userLogin,
  userRegister,
  verifyEmail,
} from "../controllers/user.controller.js";
import express from "express";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.put("/update/:id", updateUser);

export default userRouter;
