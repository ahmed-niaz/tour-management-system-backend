import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";

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
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      { new: true, runValidators: true, session: session },
    );

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

export const paymentService = {
  onPaymentCancel,
  onPaymentSuccess,
  onPaymentFailure,
};
