import { Router } from "express";
import {
  getDashboardData,
  getAllCourses,
  getSingleCourse,
  getReadingContent,
  getQuizContent,
} from "../../controllers/dashboardControllers";
import { authenticateToken } from "../../middlewares/authMiddlewares";

const router = Router();

router.get("/", authenticateToken, getDashboardData);
router.get("/all-courses", authenticateToken, getAllCourses);
router.get("/course/:id", authenticateToken, getSingleCourse);
router.get("/course/:id/reading/:docId", authenticateToken, getReadingContent);
router.get("/course/:id/quiz/:quizId", authenticateToken, getQuizContent);

export default router;
