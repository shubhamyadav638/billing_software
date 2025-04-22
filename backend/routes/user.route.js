import {
  changeUserPassword,
  removeUserImage,
  updateUser,
  userLogin,
  userRegister,
  verifyEmail,
} from "../controllers/user.controller.js";
import express from "express";
import { upload } from "../middlewares/userimg.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.put("/update/:id", upload.single("img"), updateUser);
userRouter.patch("/changepass/:id", changeUserPassword);
userRouter.delete("/removeimg/:id", removeUserImage);

export default userRouter;
