import type { Request, Response } from "express";
import * as authService from "../services/authService.js";
import * as jwt from "jsonwebtoken";
import { verifyToken } from "../lib/jwt.js";
import { sendEmail } from "../lib/email.js";
import { JWT_SECRET, FE_PORT } from "../config.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, referralCode } = req.body;
    const user = await authService.registerUser({ email, name, referralCode });

    const verificationToken = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "1h",
    });
    const verificationUrl = `{FE_PORT}auth/verfy?token=${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify Your GoGrocery Account",
      template: "verificationEmail",
      data: {
        name: user.name,
        verificationUrl: verificationUrl,
      },
    });
    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("exists") ||
        error.message.includes("Invalid referral code")
      ) {
        return res.status(400).json({ message: error.message });
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyAndSetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const decoded = verifyToken(token) as { userId: number };

    await authService.verifyAndSetUserPassword(decoded.userId, password);
    res.status(200).json({
      message: "Account verified and password set successfully. Please Log in.",
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({ message: "Login successful", ...result });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("Invalid credentials") ||
        error.message.includes("not verified")
      ) {
        return res.status(400).json({ message: error.message });
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
