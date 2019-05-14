import mongoose from "mongoose";
import IUserModel from "../../model/interfaces/user-model";

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const UserSchema = mongoose.model<IUserModel>("user", schema, "users", true);

export default UserSchema;
