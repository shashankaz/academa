import { Router } from "express";
import authRoutes from "./v1/authRoutes";
import instructorRoutes from "./v1/instructorRoutes";
import studentRoutes from "./v1/studentRoutes";
import dashboardRoutes from "./v1/dashboardRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/instructor", instructorRoutes);
router.use("/student", studentRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
