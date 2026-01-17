import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    // Cloudflare R2 S3-compatible API
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT, // e.g., https://abc123.r2.cloudflarestorage.com
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    this.bucketName = process.env.R2_BUCKET_NAME || 'sanyla-assets';
    this.publicUrl = process.env.R2_PUBLIC_URL || ''; // e.g., https://assets.sanyla.site
  }

  /**
   * Download image from URL and upload to R2
   * @returns Permanent public URL
   */
  async uploadFromUrl(
    imageUrl: string,
    path: string, // e.g., "userId/projectId/campaignId/day1-instagram.png"
  ): Promise<{ url: string; key: string }> {
    try {
      // Download image
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
      });

      const buffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'] || 'image/png';

      // Generate unique key
      const key = `${path}/${randomUUID()}.png`;

      // Upload to R2
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000', // 1 year cache
        }),
      );

      // Return public URL
      const url = this.publicUrl
        ? `${this.publicUrl}/${key}`
        : await this.getSignedUrl(key, 86400 * 365); // 1 year signed URL fallback

      return { url, key };
    } catch (error: any) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Get signed URL for private objects
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Upload buffer directly
   */
  async uploadBuffer(
    buffer: Buffer,
    key: string,
    contentType: string = 'image/png',
  ): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );

    return this.publicUrl
      ? `${this.publicUrl}/${key}`
      : await this.getSignedUrl(key);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: 'health-check.txt',
        }),
      );
      return true;
    } catch {
      return false;
    }
  }
}
