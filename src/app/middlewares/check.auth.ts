import { AppError } from "../errors/app.errors";
import status from "http-status";
import { verifyToken } from "../utils/jwt";
import { env } from "../config";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catch.async";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

// export const checkAuth =
//   (...authRoles: string[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const accessToken = req.headers.authorization;
//       console.log(accessToken);
//       if (!accessToken) {
//         throw new AppError(status.UNAUTHORIZED, "token is not found");
//       }

//       // verify token
//       const verifiedToken = verifyToken(
//         accessToken,
//         env.jwt_access_secret,
//       ) as JwtPayload;

//       if (!authRoles.includes(verifiedToken.role)) {
//         throw new AppError(status.UNAUTHORIZED, "you are not permitted");
//       }

//       next();
//     } catch (e) {
//       next(e);
//     }
//   };

export const checkAuth = (...authRoles: string[]) =>
  catchAsync(async (req, res, next) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      throw new AppError(status.UNAUTHORIZED, "token is not found");
    }

    // verify token
    const verifiedToken = verifyToken(
      accessToken,
      env.jwt_access_secret,
    ) as JwtPayload;

     // todo:  check the user is exist
      const existingUser = await User.isUserExists(verifiedToken?.email);
    
      if (!existingUser) {
        throw new AppError(status.NOT_ACCEPTABLE, "email is not exist");
      }
    
      if (existingUser.isActive === IsActive.BLOCKED || existingUser.isActive === IsActive.INACTIVE) {
        throw new AppError(status.BAD_REQUEST, "user is blocked or inactive");
      }
    
      if (existingUser.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "user is deleted");
      }

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(status.UNAUTHORIZED, "you are not permitted");
    }
    req.user = verifiedToken;
    next();
  });
