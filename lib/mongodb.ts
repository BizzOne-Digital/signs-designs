import "server-only";
import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & { __mongooseCache?: MongooseCache };

const cached: MongooseCache = globalForMongoose.__mongooseCache ?? { conn: null, promise: null };
globalForMongoose.__mongooseCache = cached;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

/**
 * Returns a cached Mongoose connection. Serverless invocations that reuse a warm
 * instance share the same connection pool instead of opening a new one per request.
 */
export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
      })
      .catch((error: unknown) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
