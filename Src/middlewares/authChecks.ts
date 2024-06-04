import { body } from "express-validator";

// email validator
export const validateSignIn = () => [
  body("username").notEmpty().escape().trim(),
  body("password").notEmpty().escape().trim().isLength({ min: 7, max: 100 }),
];

// string validator
export const stringValidator = () => [
  body("username").notEmpty().escape(),
  body("email").notEmpty().escape().trim().isEmail(),
  body("password").notEmpty().escape().trim().isLength({ min: 8, max: 100 }),
];
