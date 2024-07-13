import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
  changeCurrentPassword,
  getCurrentUser,
} from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyjwt, logoutUser);
router.route("/refreshtoken").post(verifyjwt, refreshToken);
router.route("/changepassword").post(verifyjwt, changeCurrentPassword);
router.route("/getcuser").post(verifyjwt, getCurrentUser);

export default router;
