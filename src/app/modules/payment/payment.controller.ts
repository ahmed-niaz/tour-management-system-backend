import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import { paymentService } from "./payment.service";
import { env } from "../../config";

const onPaymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.onPaymentSuccess(
    query as Record<string, string>,
  );

  res.redirect(
    `${env.ssl_success_frontend_url}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=success`,
  );
});

const onPaymentFailure = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await paymentService.onPaymentFailure(
    query as Record<string, string>,
  );
  res.redirect(
    `${env.ssl_fail_frontend_url}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=fail`,
  );
});

const onPaymentCancel = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await paymentService.onPaymentCancel(
    query as Record<string, string>,
  );

  res.redirect(
    `${env.ssl_cancel_frontend_url}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=cancel`,
  );
});

export const paymentController = {
  onPaymentCancel,
  onPaymentSuccess,
  onPaymentFailure,
};
