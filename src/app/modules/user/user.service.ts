import { IUser } from "./user.interface";
import { User } from "./user.model";

const registerUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  
  const result = await User.create({name,email});
  return result;
};

const getUser = async() => {
  const result = await User.find();

  // todo: total users
  const totalUsers = await User.countDocuments()
  return {
    data: result,
    meta: {
      total: totalUsers
    }
  };
}

export const userService = {
  registerUser,getUser
};
