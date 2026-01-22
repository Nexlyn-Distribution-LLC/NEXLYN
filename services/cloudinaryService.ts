// services/cloudinaryService.ts
import { Cloudinary } from '@cloudinary/url-gen';

// These will be set via environment variables
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  uploadPreset: process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_upload'
};

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CONFIG.cloudName
  }
});

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
