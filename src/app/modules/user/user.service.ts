import status from "http-status";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import { AppError } from "../../errors/app.errors";


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

  const result = await User.create({ ...userData, email, auths: [authProvider]  });
  return result;
 
};

const getUser = async () => {
  const result = await User.find();

  // todo: total users
  const totalUsers = await User.countDocuments();
  return {
    data: result,
    meta: {
      total: totalUsers,
    },
  };
};

export const userService = {
  registerUser,
  getUser,
};
