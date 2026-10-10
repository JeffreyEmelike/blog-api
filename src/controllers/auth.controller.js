import * as AuthService from "../services/auth.service.js";

export async function register(req, res) {
  const user = await AuthService.registerUser(req.body);
  res.status(201).json(user);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await AuthService.verifyCredentials(email, password);
  const accessToken = AuthService.generateAccessToken(user);

  res.json({ accessToken, user });
}

export async function me(req, res) {
  res.json(req.user);
}
