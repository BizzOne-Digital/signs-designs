import mongoose, { Schema, type Model } from "mongoose";

/**
 * Credentials live in environment variables (ADMIN_EMAIL / ADMIN_PASSWORD_HASH).
 * This collection records admin account activity only; it never stores the password.
 */
export interface AdminUserDoc {
  email: string;
  name: string;
  role: "admin";
  lastLoginAt?: Date;
  lastLoginIp?: string;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<AdminUserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "Administrator", trim: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const AdminUser =
  (mongoose.models.AdminUser as Model<AdminUserDoc> | undefined) ?? mongoose.model<AdminUserDoc>("AdminUser", AdminUserSchema);

export default AdminUser;
