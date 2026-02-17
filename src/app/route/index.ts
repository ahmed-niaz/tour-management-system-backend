import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { divisionRoutes } from "../modules/division/division.route";
import { tourRoutes } from "../modules/tour/tour.route";

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
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/division",
    route: divisionRoutes,
  },
  {
    path: "/tour",
    route: tourRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
