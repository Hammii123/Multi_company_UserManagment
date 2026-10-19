import express from "express";
import { registerCompany } from "../controllers/companyController.js";
import { companyRegistrationValidator } from "../validators/companyValidator.js";

const router = express.Router();

router.post(
    "/register",
    companyRegistrationValidator,
    registerCompany
);

export default router;