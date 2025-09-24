import { Router } from "express";
import {
  handleFileUpload,
  createNewCourse,
  createNewLesson,
} from "../../controllers/instructorControllers";
import { authenticateToken } from "../../middlewares/authMiddlewares";
import { hasAccess } from "../../middlewares/roleMiddlewares";
import { upload } from "../../middlewares/uploadMiddleware";

const router = Router();

router.post(
  "/upload",
  upload.single("file"),
  authenticateToken,
  hasAccess(["instructor"]),
  handleFileUpload
);
router.post(
  "/new-course",
  authenticateToken,
  hasAccess(["instructor"]),
  createNewCourse
);
router.post(
  "/new-lesson",
  authenticateToken,
  hasAccess(["instructor"]),
  createNewLesson
);

export default router;
