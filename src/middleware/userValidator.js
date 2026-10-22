
import { body, validationResult } from "express-validator";

export const createUserValidator = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .matches(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)
    .withMessage("Name must contain letters only, with optional spaces or hyphens"),

  body("email")
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .bail()
    .custom((value) => {
      const localPart = value.split("@")[0];

      if (localPart.length < 2 || !/[A-Za-z]/.test(localPart)) {
        throw new Error(
          "Email must contain at least 2 characters and one letter before @"
        );
      }

      return true;
    }),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters")
    .bail()
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one capital letter")
    .bail()
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one small letter")
    .bail()
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),

  body("role")
    .isString()
    .withMessage("Role must be a string")
    .bail()
    .isIn(["Admin", "Manager", "Employee"])
    .withMessage("Role must be Admin, Manager, or Employee")
];

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
}
