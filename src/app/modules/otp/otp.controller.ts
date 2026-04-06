import status from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { otpService } from "./otp.service";

const sendOtp = catchAsync(async (req, res) => {
    // 1. generate otp
    // 2. store in redis with expire time
    // 3. send to the email
    const {email, name} = req.body;

    await otpService.sendOtp(email,name)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'OTP generated and sent to email successfully',    
        data: null
    })
});



const verifyOtp = catchAsync(async (req, res) => {
    // 1. generate otp
    // 2. store in redis with expire time
    // 3. send to the 
    
    const {email,otp} = req.body;

    await otpService.verifyOtp(email,otp);

     sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'OTP matched & user verified successfully',    
        data: null
    })
});

export const otpController = {
    sendOtp,
    verifyOtp }