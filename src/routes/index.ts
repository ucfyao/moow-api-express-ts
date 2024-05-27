import express from "express";
import userRoutes from "./user.route";
import loginRoutes from "./login.route";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth/login", loginRoutes);

export default router;
