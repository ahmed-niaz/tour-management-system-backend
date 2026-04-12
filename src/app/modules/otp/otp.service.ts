import crypto from 'crypto';
import { redisClient } from '../../config/redis.config';
import { sendEmail } from '../../utils/send.email';
import { AppError } from '../../errors/app.errors';
import { User } from '../user/user.model';

const OTP_EXPIRATION = 2*60;

const generateOtp = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1) , 10** length).toString();
    return otp;
}

const sendOtp = async (email: string, name: string) => {
    const user = await User.findOne({email});

  if(!user) {
    throw new AppError(401,' user is not available.')
  }

    if(user.isVerified)  {
throw new AppError(401,'user already verified')
    }

    const otp = generateOtp();

    // todo: store otp in redis
    const redisKey = `otp:${email}`;

    redisClient.set(redisKey, otp, {
        expiration: {
            type: 'EX', 
            value: OTP_EXPIRATION,
           
        }
    })


 await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
        name: name, 
        otp: otp
    }
 })
    
}

const verifyOtp = async(email: string, otp: string) => {
  const user = await User.findOne({email});

  if(!user) {
    throw new AppError(401,' user is not available.')
  }

    if(user.isVerified)  {
throw new AppError(401,'user already verified')
    }
    
    const redisKey = `otp:${email}`
    const saveOtp = await redisClient.get(redisKey)

    if(!saveOtp) {
        throw new AppError(401, 'Invalid OTP')
    }

    if(saveOtp !== otp) {
        throw new AppError(401,'Invalid OTP')
    }



    await Promise.all([
     User.updateOne({email}, {isVerified: true}, {runValidators: true}),
    redisClient.del([redisKey])
    ])
}


export const otpService = {
    sendOtp,verifyOtp
}