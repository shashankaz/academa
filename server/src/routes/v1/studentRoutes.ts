import { Router } from "express";
import {
  handleCourseEnrollment,
  markLectureViewed,
  submitQuizScore,
} from "../../controllers/studentControllers";
import { authenticateToken } from "../../middlewares/authMiddlewares";
import { hasAccess } from "../../middlewares/roleMiddlewares";

const router = Router();

router.post(
  "/enroll",
  authenticateToken,
  hasAccess(["student"]),
  handleCourseEnrollment
);
router.post(
  "/lecture/viewed",
  authenticateToken,
  hasAccess(["student"]),
  markLectureViewed
);
router.post(
  "/quiz/submit",
  authenticateToken,
  hasAccess(["student"]),
  submitQuizScore
);

export default router;
