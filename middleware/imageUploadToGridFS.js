import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import path from "path";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const mongoURI = process.env.DATABASE;

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage }).single("image");

// GridFS initialization
const connect = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
connect.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "images",
  });
});

export const imageUploadToGridFS = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return next(new AppError(err.message, 500));
    }
    if (!req.file) {
      console.error("No file uploaded");
      return next(new AppError("No file uploaded", 400));
    }

    req.image = req.file.filename;

    if (req.body.json) {
      try {
        req.body = JSON.parse(req.body.json);
      } catch (err) {
        console.error("JSON parse error:", err);
        return next(new AppError("Invalid JSON in request body", 400));
      }
    }
    next();
  });
};

export const getImage = catchAsync(async (req, res, next) => {
  const { filename } = req.params;

  if (!filename) {
    return next(new AppError("No file specified", 400));
  }

  if (!gfs) {
    return next(new AppError("GridFS not initialized", 500));
  }

  const file = await gfs.find({ filename }).toArray();
  if (!file) {
    return next(new AppError("File not found", 404));
  }

  res.set("Content-Type", file[0].contentType);
  res.set("Access-Control-Allow-Origin", "*");

  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  const readStream = gfs.openDownloadStreamByName(filename);
  readStream.pipe(res);

  readStream.on("error", (err) => {
    console.error("Error reading file:", err);
    next(new AppError("Error reading file", 500));
  });
  readStream.on("end", () => {
    console.log("File read complete");
  });
});
