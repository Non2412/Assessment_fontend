import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, bucket: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  if (cached.conn) {
    return { conn: cached.conn, bucket: cached.bucket };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    // Initialize GridFS bucket
    cached.bucket = new mongoose.mongo.GridFSBucket(cached.conn.connection.db!, {
      bucketName: 'assessments_files'
    });
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return { conn: cached.conn, bucket: cached.bucket };
}

export default dbConnect;
