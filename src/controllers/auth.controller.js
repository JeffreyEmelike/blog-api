import * as AuthService from "../services/auth.service.js";

export async function register(req, res) {
  const user = await AuthService.registerUser(req.body);
  res.status(201).json(user);
}
