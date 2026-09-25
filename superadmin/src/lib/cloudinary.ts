export interface UploadProgressCallback {
  (percentage: number): void;
}

export function getStoredCloudinaryConfig() {
  if (typeof window === 'undefined') {
    return {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    };
  }

  const storedCloud = localStorage.getItem('cloudinary_cloud_name');
  const storedPreset = localStorage.getItem('cloudinary_upload_preset');

  return {
    cloudName: storedCloud || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: storedPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  };
}

export function saveStoredCloudinaryConfig(cloudName: string, uploadPreset: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cloudinary_cloud_name', cloudName.trim());
    localStorage.setItem('cloudinary_upload_preset', uploadPreset.trim());
  }
}

/**
 * Uploads a file directly to Cloudinary using an unsigned upload preset.
 */
export async function uploadToCloudinary(
  file: File,
  customConfig?: { cloudName?: string; uploadPreset?: string },
  onProgress?: UploadProgressCallback
): Promise<string> {
  const config = {
    cloudName: customConfig?.cloudName || getStoredCloudinaryConfig().cloudName,
    uploadPreset: customConfig?.uploadPreset || getStoredCloudinaryConfig().uploadPreset,
  };

  if (!config.cloudName || !config.uploadPreset) {
    throw new Error(
      'Cloudinary is not configured. Please enter your Cloud Name and Unsigned Upload Preset in the Cloudinary Settings modal.'
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) {
            resolve(data.secure_url);
          } else {
            reject(new Error('Cloudinary response did not contain secure_url.'));
          }
        } catch {
          reject(new Error('Failed to parse Cloudinary response.'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during Cloudinary upload.'));
    };

    xhr.send(formData);
  });
}
