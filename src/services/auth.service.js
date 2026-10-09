import bcrypt from "bcrypt";
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
