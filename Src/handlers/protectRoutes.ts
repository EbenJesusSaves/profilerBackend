import jwt from "jsonwebtoken";
import { env } from "process";

export const protect = (req, res, next) => {
  // input validation

  // authenticate the user
  const bearer = req.headers.authorization;

  // return if no token
  if (!bearer) {
    res.status(400).json({ message: "You are not a valid user" });
    return;
  }

  // if case bearer without token
  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(400).json({ message: "You are not a valid user again" });
    return;
  }

  const user = jwt.verify(token, env.JWT_SECRET);

  try {
    if (user) {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400);
    return;
  }
};

export const protectRoutes = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    // do some staff
  }
  const [, token] = bearer;

  if (!token) {
    // do something and reject them
  }

  if (token) {
    const user = jwt.verify(token, env.JWT_TOKEN);
    if (user) {
      // do something and call next
      next();
    } else {
      //do something and reject them
      return;
    }
  }
};
