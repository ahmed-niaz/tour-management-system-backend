/* eslint-disable no-console */
import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import { paymentService } from "./payment.service";
import { env } from "../../config";
import { sendResponse } from "../../utils/send.response";
import status from "http-status";
import { SSLCommerzService } from "../sslc/sslc.service";

const initPayment = catchAsync(async(req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await paymentService.initPayment(bookingId as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "payment successfully done",
    data: result
  })
})

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

const getInvoiceDownloadUrl = catchAsync(async(req: Request, res: Response) => {
  const paymentId = Array.isArray(req.params.paymentId)
    ? req.params.paymentId[0]
    : req.params.paymentId;
  const result = await paymentService.getInvoiceDownloadUrl(paymentId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "payment successfully done",
    data: result
  })
})


const validatePayment = catchAsync(async(req: Request, res: Response) => {
   await SSLCommerzService.validatePayment(req.body);
  console.log('ssl commerz ipn url', req.body)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "payment successfully validated",
    data: null
  })
})


export const paymentController = {
  onPaymentCancel,initPayment,getInvoiceDownloadUrl,
  onPaymentSuccess,
  onPaymentFailure,validatePayment
};
