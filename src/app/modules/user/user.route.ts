import { Request, Response, Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validate.request";
import { userValidation } from "./user.validation";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "./user.interface";

const router = Router();

// user registration
router.post(
  "/register",
  validateRequest(userValidation.createUserZodSchema),
  userController.registerUser,
);
router.get(
  "/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getUser,
);

router.get('/me', checkAuth(...Object.values(Role)), userController.getMe );
router.get("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getSingleUser);

router.patch(
  "/:id",validateRequest(userValidation.updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  userController.updateUser,
);

router.get("/", async (req: Request, res: Response) => {
  res.send({
    status: true,
    message: `route is ok ⚡`,
  });
});

export const userRoutes = router;
