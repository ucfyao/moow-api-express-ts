import mongoose from "mongoose";
const { Schema, model } = mongoose;

interface IUser {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  password: string;
  verified: boolean;
  verificationCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// JSON demo for IUser
/*
{
  "id": "test-id",
  "name": "test-name",
  "email": "test-email@gmail.com",
  "avatar": "https://test.com/avatar.jpg",
  "password": "test-pwd",
  "verified": false,
  "verificationCode": "123123",
}
*/

const userSchema = new Schema<IUser>({
  id: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true },
  avatar: { type: String },
  password: { type: String, required: true },
  verified: { type: Boolean, required: true },
  verificationCode: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
})

const User = model<IUser>("User", userSchema);

export { User, IUser };
