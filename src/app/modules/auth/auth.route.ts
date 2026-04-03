import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validate.request";
import { userValidation } from "../user/user.validation";
import passport from "passport";
import { env } from "../../config";

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
  passport.authenticate("google", { failureRedirect: `${env.frontend_url}/login?error= there are some issues in your account` }),
  authController.googleCallbackController,
);

router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  validateRequest(userValidation.changePasswordZodSchema),
  authController.changePassword,
);

router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  validateRequest(userValidation.resetPasswordZodSchema),
  authController.resetPassword,
);

router.post('/set-password', checkAuth(...Object.values(Role)), authController.setGooglePassword);
// frontend -> forgot-password -> email -> user status check -> short expiration token (valid for 10 min) - email -> get frontend link -> extacrt user email & token from the forntend -> user create new password  -> hit /reset-passowrod api in hte backend -> authoriazation = token -> new password -> token verify -> passowrd hash -> save suer passowrd.
router.post('/forget-password', authController.forgetPassowrd)

export const authRoutes = router;
