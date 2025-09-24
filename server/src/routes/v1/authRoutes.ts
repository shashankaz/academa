import { Router } from "express";
import {
  handleGetProfile,
  handleLogin,
  handleLogout,
  handleRegister,
} from "../../controllers/authControllers";
import { authenticateToken } from "../../middlewares/authMiddlewares";

const router = Router();

router.post("/login", handleLogin);
router.post("/register", handleRegister);

router.post("/logout", authenticateToken, handleLogout);
router.get("/profile", authenticateToken, handleGetProfile);

export default router;
