
import express from "express";
import helmet from "helmet";
import companyRoutes from "./routes/companyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Multi-Tenant User Management API is running"
  });
});

app.use("/api/companies", companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
