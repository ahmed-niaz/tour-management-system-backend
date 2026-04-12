import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";


// single aggregation pipeline
 const now = new Date();
 const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);


const getUserStats = async() => {
  

    const [stats] = await User.aggregate([
        {
           $facet: {
            totalUsers: [ { $count : "count"}],
            totalActiveUser: [
                {
                    $match: {
                        isActive: IsActive.ACTIVE
                    }
                }, {
                    $count: "count"
                }
            ],
            totalInActiveUser : [
                {
                    $match: {
                        isActive: IsActive.INACTIVE
                    }
                },
                {
                    $count: "count"
                }
            ]
            ,
            totalBlockedUsers: [
                {$match: {isActive: IsActive.BLOCKED}},
                {$count: "count"}
            ],
            newUserInLast7Days: [
                {$match: {
                    createdAt: {
                        $gte: sevenDaysAgo
                    }
                }},
                {
                    $count: "count"
                }
            ],
            newUserInLast30Days : [
                {
                    $match: {
                        createdAt: {
                            $gte: thirtyDaysAgo
                        }
                    }
                },
                {
                    $count: "count"
                }
            ]
            ,

             usersByRole: [
                    { $group: { _id: "$role", count: { $sum: 1 } } }
                ]
           } 
        },  {
            // Flatten count arrays to single values
            $project: {
                totalUsers: { $ifNull: [{ $arrayElemAt: ["$totalUsers.count", 0] }, 0] },
                totalActiveUsers: { $ifNull: [{ $arrayElemAt: ["$totalActiveUser.count", 0] }, 0] },
                totalInActiveUsers: { $ifNull: [{ $arrayElemAt: ["$totalInActiveUser.count", 0] }, 0] },
                totalBlockedUsers: { $ifNull: [{ $arrayElemAt: ["$totalBlockedUsers.count", 0] }, 0] },
                newUsersInLast7Days: { $ifNull: [{ $arrayElemAt: ["$newUserInLast7Days.count", 0] }, 0] },
                newUsersInLast30Days: { $ifNull: [{ $arrayElemAt: ["$newUserInLast30Days.count", 0] }, 0] },
                usersByRole: 1
            }
        }
    ])
    return stats;
}
const getBookingStats = async() => {

    const totalBookingPromise = Booking.countDocuments();

    const totalBookingStatusPromise = Booking.aggregate([
        // stage - 1: group state
        {
            $group: {
                _id: "$status",
                count : {$sum: 1}
            }
        }
    ])

    const averageGustPerBookingPromise = Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: {$avg: "$guestCount"}
            }
        }
    ])

    const bookingPerTourPromise = Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount : { $sum: 1}
            }
        }
,
        {
            $sort: {bookingCount: -1}
        },
        {
            $limit: 10
        },

        // lookup stage
        {
            $lookup: {
                from: 'tours',
                localField: "_id",
                foreignField:"_id",
                as:"tour"
            }
        }
        ,

        {
            $unwind: "$tour"
        },
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const bookingsLast7DaysPromise = Booking.countDocuments({createdAt: {$gte: sevenDaysAgo}})
    const bookingsLast30DaysPromise = Booking.countDocuments({createdAt: {$gte: thirtyDaysAgo}})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalBookingByUniquePromise = Booking.distinct('user').then((user: any) => user.length)

    const [totalBooking,totalBookingStatus, bookingPerTour,averageGustPerBooking, bookingsLast7Days,bookingsLast30Days,totalBookingByUniqueUsers] = await Promise.all([
        totalBookingPromise,totalBookingStatusPromise, bookingPerTourPromise,averageGustPerBookingPromise,bookingsLast7DaysPromise, bookingsLast30DaysPromise,totalBookingByUniquePromise
    ])

    return {totalBooking,totalBookingStatus,bookingPerTour,averageGustPerBooking: averageGustPerBooking[0].avgGuestCount,bookingsLast7Days,bookingsLast30Days,totalBookingByUniqueUsers}
}

// todo: get tour stats
const getTourStats = async() => {
   const totalTourPromise = Tour.countDocuments();

   const totalTourTypesPromise = Tour.aggregate([
    {
        $lookup: {
            from: 'tourtypes', // collection name
            localField: 'tourType' ,
            foreignField: '_id',// data base key
            as: "type" 
        }
    },

    // stage 2 : unwind the array to object
    {
        $unwind: "$type"
    },

    // stage 3: grouping the tour type
    {
        $group: {
            _id: "$type.name",
            count : {$sum: 1}
        }
    },

   
   ])

   
    const avgTourCostPromise = Tour.aggregate([
        // stage: group the cost form and average the sum
        {
            $group: {
                _id: null,
                avgCostFrom: {$avg: "$costFrom"}
            }
        }
    ])


    const totalTourByDivisonPromise = Tour.aggregate([
        // stage 1: lookup division details
        {
            $lookup: {
                from: 'divisions',
                localField: 'division',
                foreignField: '_id',
                as: 'division'
            }
        },

        // stage 2: unwind the array to object
        {
            $unwind: '$division'
        },

        // stage 3: group by division name
        {
            $group: {
                _id: '$division.name',
                count: { $sum: 1 }
            }
        }
    ])

    const totalHighestBookedTourPromise = Booking.aggregate([
        // stage-1 : Group the tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },

        //stage-2 : sort the tour

        {
            $sort: { bookingCount: -1 }
        },

        //stage-3 : sort
        {
            $limit: 5
        },

        //stage-4 lookup stage
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] }
                        }
                    }
                ],
                as: "tour"
            }
        },
        //stage-5 unwind stage
        { $unwind: "$tour" },

        //stage-6 Project stage

        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

   const [totalTours,totalTourTypes, avgTourCost, totalTourByDivison, totalHighestBookedTour] = await Promise.all([
    totalTourPromise,
    totalTourTypesPromise,avgTourCostPromise, totalTourByDivisonPromise,totalHighestBookedTourPromise
   ])
    return {totalTours,totalTourTypes, avgTourCost, totalTourByDivison,totalHighestBookedTour}
}


// todo: get payment stats
const getPaymentStats = async() => {
    const totalPaymentPromise = Payment.countDocuments();

    const totalPaymentByStatusPromise = Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count:{
                    $sum: 1
                }
            }
        }
    ])

    const totalRevenuePromise = Payment.aggregate([
        {
            $match: {
                status: PAYMENT_STATUS.PAID
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: {$sum: "$amount"}
            }
        }
    ])

    const avgPaymentAmountPromise = Payment.aggregate([
        {
            $group: {
                _id:null,
                avgPaymentAmount: {$avg: "$amount"}
            }
        }
    ])
     

    const paymentGatewayDataPromise = Payment.aggregate([
        {
            $group: {
                _id: {
                    $ifNull: ["$paymentGatewayData.status", "UNKNOWN"]
                },
                count: {$sum: 1}
            }
        }
    ])

    const [totalPayment,totalRevenue,totalPaymentByStatus,avgPaymentAmount, paymentGatewayData] = await Promise.all([
        totalPaymentPromise,totalRevenuePromise,totalPaymentByStatusPromise,avgPaymentAmountPromise, paymentGatewayDataPromise
    ])

    return {totalPayment,totalRevenue,totalPaymentByStatus,avgPaymentAmount,paymentGatewayData}
}



export const statsService = {
    getBookingStats, getPaymentStats,getUserStats,getTourStats, 
}