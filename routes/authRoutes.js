import express from "express";
import {
  createUser,
  compareTokenAndUserId,
  logOut,
  logIn,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { imageUpload } from "../middleware/imageUpload.js";
import { getImage, imageUploadToGridFS } from "../middleware/imageUploadToGridFS.js";

const router = express.Router();

router.route("/signup").post( imageUploadToGridFS, createUser);
router.route("/verifyToken").post(compareTokenAndUserId);
router.route("/logout").post(logOut);
router.route("/logIn").post(logIn);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/image/:filename").get(getImage);

export default router;
