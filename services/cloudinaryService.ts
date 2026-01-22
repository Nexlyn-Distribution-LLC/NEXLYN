// services/cloudinaryService.ts
import { Cloudinary } from '@cloudinary/url-gen';

// These will be set via environment variables
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  uploadPreset: process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_upload'
};

// Warn if using default values
if (CLOUDINARY_CONFIG.cloudName === 'demo' || CLOUDINARY_CONFIG.uploadPreset === 'unsigned_upload') {
  console.warn('⚠️ Cloudinary is using default configuration. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env.local file.');
}

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CONFIG.cloudName
  }
});

export const uploadImage = async (file: File): Promise<string> => {
  // Check if Cloudinary is properly configured
  if (CLOUDINARY_CONFIG.cloudName === 'demo' || CLOUDINARY_CONFIG.uploadPreset === 'unsigned_upload') {
    throw new Error('Cloudinary is not properly configured. Please set up your environment variables.');
  }

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
