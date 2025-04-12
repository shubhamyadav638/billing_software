import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    mobileNo: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    isEmailVerify: {
      type: Boolean,
      default: false,
    },
    isPhoneVerify: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateVerificationToken = function () {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const User = mongoose.model("User", userSchema);
