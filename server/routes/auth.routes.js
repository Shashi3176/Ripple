import { Router } from "express";
import { handleLogin,handleLogout,handleSignup } from "../controller/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup",handleSignup);
router.post("/login",handleLogin);
router.post("/logout", verifyJWT,handleLogout);

export default router;