import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post('/init-payment/:bookingId',paymentController.initPayment);
router.post("/success", paymentController.onPaymentSuccess);
router.post("/fail", paymentController.onPaymentFailure);
router.post("/cancel", paymentController.onPaymentCancel);
router.get("/invoice/:paymentId",paymentController.getInvoiceDownloadUrl);
router.post("/validate-payment", paymentController.validatePayment);

export const paymentRoutes = router;
