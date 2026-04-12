/* eslint-disable no-console */
import { cloudinaryUpload } from '../config/cloudinary.config';

export class DestroyImageFromCloudinary {

  private extractPublicId(url: string): string | null {
    try {
      if (!url || typeof url !== 'string') {
        return null;
      }

      // CloudinaryStorage provides URL like:
      // https://res.cloudinary.com/djzppynoipk/image/upload/v1753126572/uuid-tmsTimestamp-filename.ext

      // Split by /upload/ to get the path portion
      const parts = url.split('/upload/');
      if (parts.length < 2) {
        return null;
      }

      let pathAfterUpload = parts[1];

      // Remove version prefix (e.g., "v1753126572/")
      pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');

      // Handle folder structures - extract just the filename part
      const filePathParts = pathAfterUpload.split('/');
      const fileWithExt = filePathParts[filePathParts.length - 1];

      // Remove file extension from the last part
      // Our format: uuid-tmsTimestamp-originalFileName.ext
      const public_id = fileWithExt.substring(0, fileWithExt.lastIndexOf('.')).trim();

      return public_id && public_id.length > 0 ? public_id : null;
    } catch (error) {
      console.warn('Error extracting public_id:', error);
      return null;
    }
  }

  /**
   * Delete image from Cloudinary using its URL
   * @param url - Cloudinary secure URL from multer file.path
   * @returns void (silently handles errors)
   */
  async deleteImage(url: string): Promise<void> {
    try {
      if (!url) {
        console.warn('⚠️  No URL provided for image deletion');
        return;
      }

      const public_id = this.extractPublicId(url);

      if (!public_id) {
        console.warn(`⚠️  Could not extract public_id from URL: ${url}`);
        return;
      }

      // Delete from Cloudinary
      const result = await cloudinaryUpload.uploader.destroy(public_id);
      
      if (result.result === 'ok') {
        console.log(`✓ Successfully deleted from Cloudinary: ${public_id}`);
      } else {
        console.warn(`⚠️  Cloudinary deletion result not ok: ${public_id}`, result);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`✗ Error deleting from Cloudinary: ${message}`);
    }
  }
}