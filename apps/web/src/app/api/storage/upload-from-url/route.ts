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
    const missing = [];
    if (!endpoint) missing.push('R2_ENDPOINT');
    if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID');
    if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
    throw new Error(`R2 credentials not configured. Missing: ${missing.join(', ')}`);
  }

  // Ensure endpoint has https://
  const normalizedEndpoint = endpoint.startsWith('http') 
    ? endpoint 
    : `https://${endpoint}`;

  console.log(`🔧 R2 Config: endpoint=${normalizedEndpoint}, region=auto, forcePathStyle=true`);

  return new S3Client({
    region: 'auto', // Cloudflare R2 requires 'auto'
    endpoint: normalizedEndpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // CRITICAL: Required for R2 compatibility
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

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: path,
      Body: buffer,
      ContentType: contentType,
    });

    console.log(`📦 S3 Command: Bucket=${bucketName}, Key=${path}, Size=${buffer.length}`);
    
    try {
      const s3Response = await s3Client.send(putCommand);
      console.log(`✅ S3 Response:`, {
        statusCode: s3Response.$metadata.httpStatusCode,
        requestId: s3Response.$metadata.requestId,
        etag: s3Response.ETag,
      });
    } catch (s3Error: any) {
      console.error('❌ S3 SDK Error:', {
        name: s3Error.name,
        message: s3Error.message,
        code: s3Error.Code || s3Error.$metadata?.httpStatusCode,
        requestId: s3Error.$metadata?.requestId,
        statusCode: s3Error.$metadata?.httpStatusCode,
        response: s3Error.$response,
      });
      throw new Error(`R2 upload failed: ${s3Error.message} (${s3Error.name})`);
    }

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
    console.error('❌ Storage upload error:', {
      message: error.message,
      name: error.name,
      code: error.Code || error.code,
      stack: error.stack,
      requestId: error.$metadata?.requestId,
    });
    
    return NextResponse.json(
      {
        error: error.message || 'Upload failed',
        type: error.name,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
