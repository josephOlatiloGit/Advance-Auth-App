import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendResetPasswordEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";

// SIGNUP USER:
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json("All fields are required");
    }

    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const verificationToken = Math.floor(100000 + Math.random() * 900000);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24hrs
    });

    await user.save();

    // jwt after signup sent to the user
    generateTokenAndSetCookie(res, user._id);

    // send verification email to user:
    await sendVerificationEmail(user.email, verificationToken);

    console.log("user", user);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// EMAIL VERIFICATION:
export const verifyEmail = async (req, res) => {
  // The code: 123456
  const { code } = req.body;

  try {
    // Check if the user has a valid verification code:
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    /**
     * We verify the user.
     * Then we need to delete the existing
     * {verificationToken and verificationTokenExpiresAt}
     * fields form the Db.
     */
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Send welcome email:
    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail", error); //Log error for debugging
    return res.status(500).send({ message: "Server error" });
  }
};

// LOGIN USER"
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    // Save the lastLogin:
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in Login", error); //For debugging
    return res.status(400).send({ success: false, message: error.message });
  }
};

// LOGOUT:
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

//FORGOT PASSWORD :
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Generate reset token:
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // Send email, pass the reset url as second argument:
    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/rest-password/${resetToken}`
    );

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgot password reset", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// RESET PASSWORD:
export const resetPassword = async (req, res) => {
  // req the token(form URL) and password(from user input)
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find the user with the resetPasswordToken:
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    //check if token is not valid:
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    // update the password
    const hashedPassword = await bcryptjs.hashSync(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // send reset success email:
    await sendResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// CHECK AUTHENTICATION:
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); //option detached the password
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }

    return res.status(200).send({ success: true, user });
  } catch (error) {
    console.log("Error in checkAUth", error);
    return res.status(400).send({ success: false, message: error.message });
  }
};
