import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/success", paymentController.onPaymentSuccess);
router.post("/fail", paymentController.onPaymentFailure);
router.post("/cancel", paymentController.onPaymentCancel);

export const paymentRoutes = router;
