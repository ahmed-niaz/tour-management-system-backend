import { Request, Response, Router } from "express";
import { userController } from "./user.controller";


const router = Router();

// user registration
router.post("/register", userController.registerUser);
router.get('/all',userController.getUser);

router.get("/", async (req: Request, res: Response) => {
  res.send({
    status: true,
    message: `route is ok ⚡`,
  });
});

export const userRoutes = router;
