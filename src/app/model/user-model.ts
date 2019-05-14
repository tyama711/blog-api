import IUserModel from "./interfaces/user-model";

class UserModel {
  private _user: IUserModel;

  constructor(user: IUserModel) {
    this._user = user;
  }

  get username() {
    return this._user.username;
  }

  get password() {
    return this._user.password;
  }
}

Object.seal(UserModel);
export default UserModel;
