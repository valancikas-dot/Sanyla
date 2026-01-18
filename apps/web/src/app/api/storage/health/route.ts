import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

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
    throw new Error(`Missing: ${missing.join(', ')}`);
  }

  const normalizedEndpoint = endpoint.startsWith('http') 
    ? endpoint 
    : `https://${endpoint}`;

  return new S3Client({
    region: 'auto',
    endpoint: normalizedEndpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });
}

export async function GET(req: NextRequest) {
  try {
    // Only allow admins to check R2 health
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bucketName = process.env.R2_BUCKET_NAME || 'sanyla-assets';
    const endpoint = process.env.R2_ENDPOINT;
    const publicDomain = process.env.R2_PUBLIC_DOMAIN;

    // Test 1: Check environment variables
    const envCheck = {
      R2_ENDPOINT: endpoint ? '✅ Set' : '❌ Missing',
      R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing',
      R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing',
      R2_BUCKET_NAME: bucketName,
      R2_PUBLIC_DOMAIN: publicDomain || '⚠️ Not set (using default)',
    };

    // Test 2: Check bucket access
    const s3Client = getR2Client();
    let bucketCheck;
    try {
      await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      bucketCheck = { status: '✅ Accessible', bucket: bucketName };
    } catch (err: any) {
      bucketCheck = {
        status: '❌ Failed',
        bucket: bucketName,
        error: err.message,
        code: err.Code || err.$metadata?.httpStatusCode,
      };
    }

    // Test 3: Try test upload
    const testKey = `_health-check/${Date.now()}.txt`;
    const testData = Buffer.from(`Health check - ${new Date().toISOString()}`);
    let uploadCheck;
    try {
      const response = await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: testKey,
          Body: testData,
          ContentType: 'text/plain',
        })
      );
      uploadCheck = {
        status: '✅ Success',
        key: testKey,
        etag: response.ETag,
        httpStatusCode: response.$metadata.httpStatusCode,
      };
    } catch (err: any) {
      uploadCheck = {
        status: '❌ Failed',
        key: testKey,
        error: err.message,
        code: err.Code || err.$metadata?.httpStatusCode,
        requestId: err.$metadata?.requestId,
      };
    }

    const allPassed = 
      envCheck.R2_ENDPOINT?.includes('✅') &&
      envCheck.R2_ACCESS_KEY_ID?.includes('✅') &&
      envCheck.R2_SECRET_ACCESS_KEY?.includes('✅') &&
      bucketCheck.status?.includes('✅') &&
      uploadCheck.status?.includes('✅');

    return NextResponse.json({
      healthy: allPassed,
      timestamp: new Date().toISOString(),
      checks: {
        environment: envCheck,
        bucket: bucketCheck,
        upload: uploadCheck,
      },
      config: {
        endpoint: endpoint?.replace(/https?:\/\//, ''), // Hide protocol
        region: 'auto',
        forcePathStyle: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
