import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';

// Initialize S3 client for Cloudflare R2
function getR2Client() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not configured');
  }

  return new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, path } = await req.json();

    if (!imageUrl || !path) {
      return NextResponse.json(
        { error: 'Missing imageUrl or path' },
        { status: 400 }
      );
    }

    // Download image from DALL-E URL
    console.log(`📥 Downloading image from DALL-E...`);
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30s timeout
    });

    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'] || 'image/png';

    // Upload to R2
    console.log(`📤 Uploading to R2: ${path}`);
    const s3Client = getR2Client();
    const bucketName = process.env.R2_BUCKET_NAME || 'sanyla-assets';

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: path,
        Body: buffer,
        ContentType: contentType,
      })
    );

    // Build public URL
    const publicDomain = process.env.R2_PUBLIC_DOMAIN || `${bucketName}.r2.dev`;
    const publicUrl = `https://${publicDomain}/${path}`;

    console.log(`✅ Saved to R2: ${publicUrl}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key: path,
      size: buffer.length,
      contentType,
    });
  } catch (error: any) {
    console.error('Storage upload error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Upload failed',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
