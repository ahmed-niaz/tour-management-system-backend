import multer from "multer";
import { cloudinaryRoot } from "./cloudinary.config";
import { Request } from "express";
import crypto from "crypto";

// multer-storage-cloudinary@2.2.1 exports a factory function, not a class
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cloudinaryStorage = require("multer-storage-cloudinary");

const storage = cloudinaryStorage({
  cloudinary: cloudinaryRoot,
  // params must be a FUNCTION (req, file, cb) — not a plain object.
  // The library uses _getParamGetter which only invokes it as a callback
  // when typeof params === 'function'. A plain object with function-valued
  // properties would be passed as-is to Cloudinary, causing the
  // "public_id must not end with a whitespace" error.
  params: (req: Request, file: Express.Multer.File, cb: (err: Error | null, params: Record<string, unknown>) => void) => {
    try {
      const uuid = crypto.randomUUID();
      const timestamp = Date.now();

      // Remove the file extension — Cloudinary determines format from the uploaded file
      const dotIndex = file.originalname.lastIndexOf('.');
      const nameWithoutExt = dotIndex > 0
        ? file.originalname.substring(0, dotIndex)
        : file.originalname;

      const sanitizedName = nameWithoutExt
        .trim()
        .replace(/\s+/g, '_')              // Replace whitespace with underscore
        .replace(/[^a-zA-Z0-9_-]/g, '_');  // Replace remaining invalid chars

      const public_id = `${uuid}-tms${timestamp}-${sanitizedName}`.trim();

      cb(null, { public_id });
    } catch (err) {
      cb(err as Error, {});
    }
  },
});

export const multerUpload = multer({ storage: storage });

