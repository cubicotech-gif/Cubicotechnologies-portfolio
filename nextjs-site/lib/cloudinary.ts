import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Upload image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Cloudinary folder path (default: cubico-portfolio/hero)
 * @returns Upload result with public_id and secure_url
 */
export async function uploadToCloudinary(
  file: string,
  folder: string = 'cubico-portfolio/hero'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 1200, crop: 'fill', quality: 'auto' },
      ],
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public_id
 * @returns Deletion result
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

/**
 * Get optimized Cloudinary URL
 * @param publicId - Cloudinary public_id
 * @param width - Desired width (default: 600)
 * @param height - Desired height (default: 800)
 * @returns Optimized image URL
 */
export function getCloudinaryUrl(
  publicId: string,
  width: number = 600,
  height: number = 800
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/${publicId}`;
}

/**
 * List all images in a folder
 * @param folder - Cloudinary folder path
 * @returns Array of resources
 */
export async function listCloudinaryImages(folder: string = 'cubico-portfolio/hero') {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 500,
    });
    return result.resources;
  } catch (error) {
    console.error('Error listing Cloudinary images:', error);
    throw new Error('Failed to list Cloudinary images');
  }
}

export default cloudinary;
