import express from "express";
import {
  createBlog,
  getBlog,
  getBlogs,
} from "../controllers/blogController.js";
import { protect } from "../controllers/protect.js";
import { imageUpload } from "../middleware/imageUpload.js";
import {
  getImage,
  imageUploadToGridFS,
} from "../middleware/imageUploadToGridFS.js";

const router = express.Router();

router.route("/").post(protect, imageUploadToGridFS, createBlog).get(getBlogs);
router.route("/:id").get(getBlog);
router.route("/image/:filename").get(getImage);

export default router;
