import { Router } from "express";
import { checkAuth } from "../../middlewares/check.auth";
import { bookingController } from "./booking.controller";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validate.request";
import { createBookingZodSchema } from "./booking.validation";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),validateRequest(createBookingZodSchema),
  bookingController.createBooking,
);

router.get('/',checkAuth(Role.ADMIN,Role.SUPER_ADMIN),bookingController.getAllBookings);
router.get('/my-bookings',bookingController.getUserBooking);

export const bookingRoutes = router;
