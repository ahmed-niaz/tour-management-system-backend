/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { AppError } from "../../errors/app.errors";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import {  IInvoiceData, PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { SSLCommerzService } from "../sslc/sslc.service";
import { ISSLCommerz } from "../sslc/sslc.interface";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { generatePdf } from "../../utils/invoice";
import { sendEmail } from "../../utils/send.email";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";


const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({booking:bookingId});

  if(!payment) {
    throw new AppError(status.NOT_FOUND, 'Payment not found.You have not booked this tour')
  }

  const booking = await Booking.findById(payment.booking);

   const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLCommerzService.sslPaymentInitialization(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }
}

const onPaymentSuccess = async (query: Record<string, string>) => {
  // todo: update booking status PENDING to COMPLETE
  // todo: update payment status UNPAID to PAID.
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { new: true, runValidators: true, session: session },
    );

   


    // udpated booking
  const updatedBooking =   await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      { new: true, runValidators: true, session: session },
    ).populate("tour","title").populate("user", "name email");

    if(!updatedBooking) {
      throw new AppError(401,'booking not found');
    }

    if(!updatedPayment?.transactionId) {
      throw new AppError(400,'Transaction ID not found');
    }

    const invoiceData : IInvoiceData = {
      bookingDate : updatedBooking?.createdAt as Date,             
      guestCount: updatedBooking?.guestCount,
      tourTitle: (updatedBooking?.tour as unknown as ITour).title,
      transactionId: updatedPayment.transactionId,
      userName: (updatedBooking.user as unknown as IUser).name,
      totalAmount: updatedPayment?.amount || 0,
    }

     // generated PDF
     const pdfBuffer = await generatePdf(invoiceData);

     const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice")

    //  console.log('cloudinary-file pdf version',cloudinaryResult);
    if(!cloudinaryResult?.secure_url) {
      throw new AppError(401,'secure url not found');
    }

    await Payment.findByIdAndUpdate(updatedPayment._id,{invoiceUrl: cloudinaryResult?.secure_url}, {runValidators:true, session})

     await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject:'Your Booking Invoice',
      templateName: 'invoice',
      templateData: invoiceData ,
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
     })


    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "payment completed " };
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const onPaymentFailure = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session: session },
    );

    // update booking
    Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session: session },
    );

    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "payment failed " };
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const onPaymentCancel = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      {
        transactionId: query?.transactionId,
      },
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session: session },
    );

    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session: session },
    );
    await session.commitTransaction();
    session.endSession();
    return { success: false, message: "payment canceled " };
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const  getInvoiceDownloadUrl =async (paymentId: string) => {
  const payment = await Payment.findById(paymentId).select('invoiceUrl')

  if(!payment) {
    throw new AppError(401, 'Payment not found')
  }

  if(!payment.invoiceUrl) {
  throw new AppError(401, 'No invoice found')
  }

  return payment.invoiceUrl
}



export const paymentService = {
  onPaymentCancel,initPayment,
  onPaymentSuccess,
  onPaymentFailure,getInvoiceDownloadUrl
};
