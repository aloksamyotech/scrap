import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    opt: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Auth = mongoose.model("otp", otpSchema);
