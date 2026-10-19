import {body} from "express-validator";

export const loginValidator = [
    body("companyEmail")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail() ,

    body("email")
    .trim()
    .isEmail()
    .withMessage("A valid user email is required")
    .normalizeEmail(),

    body("password")
    .isString()
    .notEmpty()
    .withMessage("Password is required")
]