import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.hostinger.com",
//   port: 587,
//   service: "smtp",
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

//!===================== Register logic ============
export const userRegister = async (req, res) => {
  try {
    const { fullName, email, mobileNo, password } = req.body;

    if (!fullName || !email || !mobileNo || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    const contactRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    if (!contactRegex.test(mobileNo)) {
      return res
        .status(400)
        .json({ success: false, message: "Contact number must be 10 digits" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      mobileNo,
      password: hashedPassword,
      isEmailVerify: false,
      isActive: 0,
    });

    // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // const verifyUrl = `http://localhost:3000/api/v1/user/verify-email/${token}`;
    // await transporter.sendMail({
    //   to: email,
    //   subject: "Verify Your Email",
    //   html: `<p>Hi ${fullName},</p><p>Please Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
    // });

    // return res.status(200).json({
    //   success: true,
    //   message: `Verification email sent to ${email}. Please check your inbox.`,
    // });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      User: { id: newUser._id, fullName, email },
    });
  } catch (error) {
    console.error("Error  registration:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//!=================== verify email logic ============
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (user.isEmailVerify) {
      return res.status(409).json({
        success: false,
        message: "Email already verified.",
      });
    }

    user.isEmailVerify = true;
    user.isActive = 1;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

//!===================== Login logic ============
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email ",
      });
    }

    // console.log("Entered password:", password);
    // console.log("Stored hash:", user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log("Password match:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT Secret is not defined in environment variables");
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    // if (user.isActive === 0) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Your account is not activated yet.",
    //   });
    // }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
      // user: {

      //   // id: user._id,
      //   // fullName: user.fullName,
      //   // email: user.email,
      //   // mobileNo: user.mobileNo,
      //   // isActive: user.isActive,
      // },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//!================ Edit user profile ===========
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, mobileNo, address, email } = req.body;
    const imgFile = req.file;

    const updatedData = {};

    if (fullName) updatedData.fullName = fullName;
    if (address) updatedData.address = address;

    if (mobileNo) {
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(mobileNo)) {
        return res.status(400).json({
          success: false,
          message: "Mobile number must be exactly 10 digits",
        });
      }
      updatedData.mobileNo = mobileNo;
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another account",
        });
      }

      updatedData.email = email;
      // Optional: Uncomment the following if you want email re-verification
      /*
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const verifyUrl = `http://localhost:3000/api/v1/user/verify-email/${token}`;
      await transporter.sendMail({
        to: email,
        subject: "Verify Your New Email",
        html: `<p>Please verify your new email by clicking <a href="${verifyUrl}">here</a>.</p>`,
      });
      */
    }

    if (imgFile) {
      if (user.imgUrl) {
        const oldImagePath = path.join(
          "public/userimg",
          path.basename(user.imgUrl)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updatedData.imgUrl = `${req.protocol}://${req.get("host")}/userimg/${
        imgFile.filename
      }`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mobileNo: updatedUser.mobileNo,
        address: updatedUser.address,
        isEmailVerify: updatedUser.isEmailVerify,
        imgUrl: updatedUser.imgUrl,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//!=================== Remove Image ==============

export const removeUserImage = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.imgUrl) {
      const imagePath = path.join("public/userimg", path.basename(user.imgUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      user.imgUrl = null;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNo: user.mobileNo,
        address: user.address,
        isEmailVerify: user.isEmailVerify,
        imgUrl: user.imgUrl,
      },
    });
  } catch (error) {
    console.error("Error removing profile image:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing the image",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//!================ Change user password ===========
export const changeUserPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
