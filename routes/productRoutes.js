import express from "express";
import {
  createProduct,
  getProduct,
  getProducts,
} from "../controllers/productController.js";
import { protect } from "../controllers/protect.js";
import { imageUpload } from "../middleware/imageUpload.js";
import {
  getImage,
  imageUploadToGridFS,
} from "../middleware/imageUploadToGridFS.js";

const router = express.Router();

router
  .route("/")
  .post(protect, imageUploadToGridFS, createProduct)
  .get(getProducts);
router.route("/:slug").get(getProduct);
router.route("/image/:filename").get(getImage);

export default router;
