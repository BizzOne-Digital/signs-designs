import mongoose, { Schema, type Model } from "mongoose";

/** Fixed-window counters shared across serverless instances. Expired windows are removed by TTL. */
export interface RateLimitDoc {
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<RateLimitDoc>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimit =
  (mongoose.models.RateLimit as Model<RateLimitDoc> | undefined) ?? mongoose.model<RateLimitDoc>("RateLimit", RateLimitSchema);

export default RateLimit;
