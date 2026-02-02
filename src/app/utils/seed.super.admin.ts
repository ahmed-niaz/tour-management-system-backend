/* eslint-disable no-console */
import { env } from "../config";
import { IAuthProvider,Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";


export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      email: env.super_admin_email,
    });
    
    if (isSuperAdminExists) {
      console.log("Super admin already exists");
      return;
    }

    // const hashedPassword = await bcrypt.hash(
    //   env.super_admin_password,
    //   Number(env.bcrypt_salt_rounds),
    // );

    const authProvider: IAuthProvider = {
      provider: "credential",
      providerId: env.super_admin_email,
    };

    const payload = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: env.super_admin_email,
      password: env.super_admin_password,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log("Super admin created successfully");
    console.log(superAdmin);
  } catch (e) {
    console.error("Error seeding super admin:", e);
    throw e;
  }
};