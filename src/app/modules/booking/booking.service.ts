import status from "http-status";
import { AppError } from "../../errors/app.errors";
import QueryBuilder from "../../utils/queryBuilders";
import { User } from "../user/user.model";
import { bookingSearchableFields } from "./booking.constant";
import { IBooking } from "./booking.interface";
import { Booking } from "./booking.model";
import { getTransactionId } from "../../utils/transaction.id";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { ISSLCommerz } from "../sslc/sslc.interface";
import { SSLCommerzService } from "../sslc/sslc.service";
import { IUser } from "../user/user.interface";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);
    const transactionId = getTransactionId();

    if (!user?.phone || !user.address) {
      throw new AppError(
        status.BAD_REQUEST,
        "please update your profile first",
      );
    }

    // todo: get single data
    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(status.BAD_REQUEST, "tour cost not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!);

    // todo: create booking
    const booking = await Booking.create(
      [
        {
          user: userId,
          ...payload,
        },
      ],
      { session },
    );

    // todo: create payment
    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: amount,
        },
      ],
      { session },
    );

    // todo: update booking after creating a payment
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    // todo: how to get the address form the user
    const userAddress = (updatedBooking?.user as unknown as IUser).address;
    const userEmail = (updatedBooking?.user as unknown as IUser).email;
    const userPhoneNumber = (updatedBooking?.user as unknown as IUser).phone;
    const userName = (updatedBooking?.user as unknown as IUser).name;

    if (!userAddress || !userEmail || !userPhoneNumber || !userName) {
      throw new AppError(status.BAD_REQUEST, "user information is incomplete");
    }

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount: amount,
      transactionId: transactionId,
    };
    const sslPayment: ISSLCommerz =
      await SSLCommerzService.sslPaymentInitialization(sslPayload);
    // eslint-disable-next-line no-console
    console.log(sslPayment);

    await session.commitTransaction();
    session.endSession();
    return {
      booking: updatedBooking,
      paymentUrl: sslPayment.GatewayPageURL,
    };
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    throw e;
  }
};

const getAllBookings = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(Booking.find(), query)
    .search(bookingSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  const data = await bookingQuery.modelQuery;
  const meta = await bookingQuery.countTotal();
  return { data, meta };
};

const getUserBooking = async () => {
  return {};
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getUserBooking,
};
