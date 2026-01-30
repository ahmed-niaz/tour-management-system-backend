import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validate.request";
import { userValidation } from "../user/user.validation";


const router = Router();

router.post("/login", authController.credintialsLogin);
router.post("/refresh-token",authController.generateAccessToken);
router.post("/logout",authController.logOut)


router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  validateRequest(userValidation.resetPasswordZodSchema),
  authController.resetPassword,
);

export const authRoutes = router;
