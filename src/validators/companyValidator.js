
import { body } from "express-validator";

const emailRule = (field) =>
  body(field)
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .bail()
    .custom((value) => {
      const emailName = value.split("@")[0];

      if (
        emailName.length < 2 ||
        !/[A-Za-z]/.test(emailName)
      ) {
        throw new Error(
          "Email must contain at least 2 characters and one letter before @"
        );
      }

      return true;
    })
    .normalizeEmail();

const nameRule = (field) =>
  body(field)
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Name must not exceed 150 characters")
    .bail()
    .matches(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)
    .withMessage("Name must contain letters, spaces, apostrophes, or hyphens only");

const passwordRule = (field) =>
  body(field)
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
    .withMessage("Password must contain at least one special character");

export const companyRegistrationValidator = [
  nameRule("companyName"),
  body("companyName")
    .isLength({ max: 150 })
    .withMessage("Company name must not exceed 150 characters"),

  emailRule("companyEmail"),
  nameRule("adminName"),
  emailRule("adminEmail"),
  passwordRule("password")
];
