import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, IUserModel, Role } from "./user.interface";
import bcrypt from 'bcrypt'
import { env } from "../../config";


// embaded schema
const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
        type: String,
        required: true,
    },
    providerId: {
        type: String,
        required: true,
    }
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: {
      type: String,
    },
    picture: {
      type: String,
    },
    address: {
      type: String,
    },
    isDeleted: {
      type: String,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    auths: [authProviderSchema],

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// pre middleware hooks
userSchema.pre('save', async function (this) {
  if (!this.isModified('password') || !this.password) return;
  const hashed = await bcrypt.hash(
    String(this.password), Number(env.bcrypt_salt_rounds)
  );
  this.password = hashed;
})

//  Check if user exists by email - static method
userSchema.statics.isUserExists = async function (email: string) {
  return await this.findOne({ email }).select("+password");
};

// static method - passwordMatched
userSchema.statics.isPasswordMatched = async function (plainTextPassword,hashedPassword) {
  return await bcrypt.compare(plainTextPassword,hashedPassword)
}

export const User = model<IUser,IUserModel>("User", userSchema)