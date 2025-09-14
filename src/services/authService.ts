import { prisma } from "../lib/prisma.js";
import * as bcrypt from "bcryptjs";
import { signToken } from "../lib/jwt.js";

interface RegisterInput {
  email: string;
  name: string;
  referralCode?: string;
}

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  let referrerId: number | undefined = undefined;
  if (input.referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: input.referralCode },
    });
    if (!referrer) {
      throw new Error("Invalid referral code");
    }
    referrerId = referrer.id;
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      ...(referrerId !== undefined ? { referrerId } : {}),
    },
  });

  return user;
};

export const verifyAndSetUserPassword = async (
  userId: number,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      isVerified: true,
    },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }
  if (!user.isVerified) {
    throw new Error("User is not verified");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ userId: user.id });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};
