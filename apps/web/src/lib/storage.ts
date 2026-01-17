/**
 * Client-side storage helper for uploading images to R2
 * This wraps the API storage service for use in Next.js routes
 */

interface StorageUploadResult {
  url: string;
  key: string;
  size?: number;
}

/**
 * Upload image from DALL-E temporary URL to permanent R2 storage
 * @param imageUrl - Temporary DALL-E image URL (expires in 1h)
 * @param path - Destination path in R2 bucket (e.g., "userId/projectId/filename.png")
 * @returns Permanent R2 URL and object key
 */
export async function uploadImageToStorage(
  imageUrl: string,
  path: string
): Promise<StorageUploadResult> {
  try {
    // Call internal API endpoint that uses StorageService
    const response = await fetch('/api/storage/upload-from-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl, path }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Storage upload failed');
    }

    const result = await response.json();
    return {
      url: result.url,
      key: result.key,
      size: result.size,
    };
  } catch (error: any) {
    console.error('Storage upload error:', error);
    
    // Fallback: return original URL (will expire but better than crashing)
    console.warn('⚠️ Using temporary DALL-E URL (will expire in 1h)');
    return {
      url: imageUrl,
      key: path,
    };
  }
}

/**
 * Upload image buffer directly to R2
 * @param buffer - Image buffer
 * @param path - Destination path
 * @param contentType - MIME type (default: image/png)
 */
export async function uploadBufferToStorage(
  buffer: Buffer,
  path: string,
  contentType: string = 'image/png'
): Promise<StorageUploadResult> {
  const response = await fetch('/api/storage/upload-buffer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      buffer: buffer.toString('base64'),
      path,
      contentType,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Buffer upload failed');
  }

  return response.json();
}

/**
 * Generate signed URL for private R2 objects
 * @param key - R2 object key
 * @param expiresIn - Expiration in seconds (default: 1h)
 */
export async function getSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const response = await fetch('/api/storage/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, expiresIn }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate signed URL');
  }

  const result = await response.json();
  return result.url;
}

/**
 * Delete object from R2
 * @param key - R2 object key
 */
export async function deleteFromStorage(key: string): Promise<void> {
  const response = await fetch('/api/storage/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete from storage');
  }
}
