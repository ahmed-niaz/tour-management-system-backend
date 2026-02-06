import { Router } from "express";
import { divisionController } from "./division.controller";
import { divisionValidation } from "./division.validation";
import validateRequest from "../../middlewares/validate.request";
import { checkAuth } from "../../middlewares/check.auth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(divisionValidation.createDivisionZodSchema),
  divisionController.createDivision,
);

router.get("/all", divisionController.getAllDivisions);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(divisionValidation.updateDivisionSchema),
  divisionController.updateDivision,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.deleteDivision,
);
export const divisionRoutes = router;
