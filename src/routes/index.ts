import express from "express";
import userRoutes from "./userRoute";
import loginRoutes from "./loginRoute";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth/login", loginRoutes);

export default router;
