import jwt from "jsonwebtoken";
import { JWT_EXPIRED, JWT_SECRET } from "../config.js";

const SECRET_KEY = JWT_SECRET;
const JWT_EXPIRED_STRING = JWT_EXPIRED;

if (!SECRET_KEY || !JWT_EXPIRED_STRING) {
  throw new Error(
    "Missing required environment variables: JWT_SECRET or JWT_EXPIRED"
  );
}

const JWT_EXPIRED_IN = Number(JWT_EXPIRED_STRING);

export const signToken = (payload: { userId: number }) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: JWT_EXPIRED_IN });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
