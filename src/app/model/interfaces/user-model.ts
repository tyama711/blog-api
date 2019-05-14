import mongoose from "mongoose";

export default interface UserModel extends mongoose.Document {
  username: string;
  password: string;
}
