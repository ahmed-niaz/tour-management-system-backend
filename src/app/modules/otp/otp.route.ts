// create otp -  then store in redis - send to the email
// fronend - verify [ redis otp === fronend otp] - ok - [ user isVerified = true ] - send access token to frontend
import express from 'express';
import { otpController } from './otp.controller';

const router = express.Router();

router.post('/generate', otpController.sendOtp);
router.post('/verify', otpController.verifyOtp);

export const otpRoute = router;