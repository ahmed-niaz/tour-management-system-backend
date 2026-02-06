import { Router } from "express";
import { tourController } from "./tour.controller";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validate.request";
import {
  createTourTypeZodSchema,
  updateTourZodSchema,
} from "./tour.validation";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  tourController.createTourType,
);

router.get("/tour-types", tourController.getTourTypes);

router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.updateTourType,
);

router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTourType,
);

/*--------------- TOUR ROUTES-----------------*/
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.createTour,
);

router.get("/all", tourController.getAllTours);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  tourController.updateTour,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  tourController.deleteTour,
);

export const tourRoutes = router;
