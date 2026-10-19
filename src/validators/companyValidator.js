import { body } from "express-validator";

export const companyRegistrationValidator = [
    body("companyName") 
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({max:150})
    .withMessage("Company name must not exceed 150 characters"),

    body("companyEmail")
    .trim()
    .isEmail()
    .withMessage("A valid company email is required")
    .normalizeEmail(),



    body("adminName")
    .trim()
    .notEmpty()
    .withMessage("Admin name must not exceed 150 characters"),


    body("adminEmail")
    .trim()
    .isEmail()
    .withMessage("A valid admin email is required")
    .normalizeEmail(),

    body("password")
    .isString()
    .isLength({min:8 , max:72})
    .withMessage("password must be between 8 and 27 characters")
];