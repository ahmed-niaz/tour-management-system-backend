import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validate.request";
import { userValidation } from "../user/user.validation";
import passport from "passport";

const router = Router();

router.post("/login", authController.credintialsLogin);
router.post("/refresh-token", authController.generateAccessToken);
router.post("/logout", authController.logOut);
router.get(
  "/google",
  async (req: Request, res: Response, _next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res);
  },
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallbackController,
);

router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  validateRequest(userValidation.resetPasswordZodSchema),
  authController.resetPassword,
);

export const authRoutes = router;
