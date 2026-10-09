import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UsersModel from "../models/users.model.js";
import { AppError } from "../utils/AppError.js";

const SALT_ROUNDS = 10;

export async function registerUser({ name, email, password }) {
  const existing = await UsersModel.findByEmail(email);
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UsersModel.create({ name, email, passwordHash });

  return user;
}

export async function verifyCredentials(email, password) {
  const user = await UsersModel.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function generateAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
}
