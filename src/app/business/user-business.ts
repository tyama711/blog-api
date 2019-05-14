import UserRepository from "../repository/user-repository";
import IUserBusiness from "./interfaces/user-business";
import IUserModel from "../model/interfaces/user-model";

class UserBusiness implements IUserBusiness {
  private _userRepository: UserRepository;

  constructor() {
    this._userRepository = new UserRepository();
  }

  async create(item: IUserModel) {
    return await this._userRepository.create(item);
  }

  async retrieve() {
    return await this._userRepository.retrieve();
  }

  async update(_id: string, item: IUserModel) {
    return await this._userRepository.update(_id, item);
  }

  async delete(_id: string) {
    return await this._userRepository.delete(_id);
  }

  async findOne(conditions: Partial<IUserModel>, projection?: any) {
    const defaultProjection = { _id: 0 };
    if (projection) {
      Object.assign(defaultProjection, projection);
    }
    return await this._userRepository.findOne(conditions, defaultProjection);
  }
}

Object.seal(UserBusiness);
export default UserBusiness;
