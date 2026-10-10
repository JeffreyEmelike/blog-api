import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export function requireAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  const token = authHeader?.startsWith("Bearer") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
  } catch {}
  next();
}
