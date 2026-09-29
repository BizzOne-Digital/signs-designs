import "server-only";
import { dbConnect } from "@/lib/mongodb";
import { isDuplicateKeyError } from "@/lib/api";
import RateLimit from "@/models/RateLimit";

export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

const memoryBuckets = new Map<string, { count: number; expiresAt: number }>();

function memoryLimit(key: string, limit: number, expiresAt: number): RateLimitResult {
  const now = Date.now();
  for (const [k, v] of memoryBuckets) if (v.expiresAt <= now) memoryBuckets.delete(k);
  const bucket = memoryBuckets.get(key) ?? { count: 0, expiresAt };
  bucket.count += 1;
  memoryBuckets.set(key, bucket);
  return {
    allowed: bucket.count <= limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfterSeconds: Math.ceil((bucket.expiresAt - now) / 1000),
  };
}

/**
 * Fixed-window rate limiter stored in MongoDB so the limit holds across serverless instances.
 * Falls back to per-instance memory if the database is unreachable.
 */
export async function rateLimit(scope: string, identifier: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  const windowMs = windowSeconds * 1000;
  const bucketIndex = Math.floor(Date.now() / windowMs);
  const key = `${scope}:${identifier}:${bucketIndex}`;
  const expiresAt = (bucketIndex + 1) * windowMs;

  const run = async () => {
    const doc = await RateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(expiresAt) } },
      { upsert: true, returnDocument: "after" },
    ).lean();
    const count = doc?.count ?? 1;
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      retryAfterSeconds: Math.ceil((expiresAt - Date.now()) / 1000),
    };
  };

  try {
    await dbConnect();
    try {
      return await run();
    } catch (error) {
      // Two concurrent upserts can race on the unique key; the retry hits the existing doc.
      if (isDuplicateKeyError(error)) return await run();
      throw error;
    }
  } catch (error) {
    console.error("[rate-limit] falling back to memory:", error);
    return memoryLimit(key, limit, expiresAt);
  }
}
