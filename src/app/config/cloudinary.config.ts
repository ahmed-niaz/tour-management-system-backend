import cloudinaryModule from 'cloudinary'
import { env } from "./index";

const cloudinary = cloudinaryModule.v2;

cloudinary.config({ 
  cloud_name: env.cloudinary_cloud_name , 
  api_key: env.cloudinary_api_key , 
  api_secret: env.cloudinary_api_secret 
});

// v2 instance (configured) — used for direct API calls (e.g., uploader.destroy)
export const cloudinaryUpload = cloudinary;

// Root module — needed by multer-storage-cloudinary@2.2.1 which accesses .v2 internally
export const cloudinaryRoot = cloudinaryModule;