import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";

const router = Router();

// Define module route types
interface ModuleRoute {
  path: string;
  route: Router;
}

const moduleRoutes: ModuleRoute[] = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
