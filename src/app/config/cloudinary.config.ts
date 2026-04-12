/* eslint-disable no-console */
import cloudinaryModule, { UploadApiResponse } from 'cloudinary'
import { env } from "./index";
import crypto from 'crypto'
import { AppError } from "../errors/app.errors";


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


// todo: manually upload pdf to the cloudinary after complete the purchase of the booking

export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined>  => {
  try {
    const public_id = `pdf/${crypto.randomUUID()}-${Date.now()}-${fileName}`

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', public_id: public_id,folder: "pdf" },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )

      uploadStream.end(buffer)
    })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e)
    throw new AppError(401, `error uploading file ${e.message}`)
  }
}