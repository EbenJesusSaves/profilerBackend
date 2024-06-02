import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "process";
//hash password
export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const createJWTToken = (user) => {
  const { username, id } = user || {};

  return jwt.sign({ username, id }, env.JWT_SECRET);
};
