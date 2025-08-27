import { Router } from "express";
import { signup, login } from "../controllers/authController";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.post("/signup", upload.single("profile"), signup);
router.post("/login", login);

export default router;
