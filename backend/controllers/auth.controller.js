import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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
