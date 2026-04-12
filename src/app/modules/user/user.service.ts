import status from "http-status";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { AppError } from "../../errors/app.errors";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../utils/queryBuilders";
import { userSearchableFields } from "./user.constant";

const registerUser = async (payload: IUser) => {
  const { email, ...userData } = payload;

  // Check if the user already exists by email
  const existingUser = await User.isUserExists(email);

  if (existingUser) {
    throw new AppError(status.NOT_ACCEPTABLE, "Email is already registered");
  }

  // const hashedPassword = await bcrypt.hash(password as string, 10)

  // auth provider
  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const result = await User.create({
    ...userData,
    email,
    auths: [authProvider],
  });
  return result;
};

// update user
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {

  if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    if(userId !== decodedToken.userId) {
      throw new AppError(status.BAD_REQUEST, 'you are not authoirzed')
    }
  }


  const isUserExists = await User.findById(userId);

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "user not found");
  }

  if(decodedToken.role === Role.ADMIN && isUserExists.role === Role.SUPER_ADMIN) {
    throw new AppError(status.NOT_FOUND,'you are not authorized')
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(status.FORBIDDEN, "You are not authorized");
    }

    // if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    //   throw new AppError(status.FORBIDDEN, "You are not authorized");
    // }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(status.FORBIDDEN, "You are not authorized");
    }
  }

  // if (payload.password) {
  //   // payload.password = await bcrypt.hash(
  //   //   payload.password,
  //   //   Number(env.bcrypt_salt_rounds),
  //   // );

  //   const rounds = Number(env.bcrypt_salt_rounds) || 10;
  //   payload.password = await bcrypt.hash(payload.password, rounds);
  // }

  const userUpdated = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return userUpdated;
};

const getSingleUser = async(userId: string) => {
const user = await User.findById(userId).select("-password");
return {
  data: user
}
}

const getMe = async(userId: string) => {
const user = await User.findById(userId).select("-password");
return {
  data: user
}
}

const getUser = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const data = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return { data, meta };
};

export const userService = {
  registerUser,getSingleUser,
  updateUser,getMe,
  getUser,
};
