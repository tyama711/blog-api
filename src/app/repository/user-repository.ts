import IUserModel from '../model/interfaces/user-model'
import UserSchema from '../data-access/schemas/user-schema'
import RepositoryBase from './base/repository-base'

class UserRepository extends RepositoryBase<IUserModel> {
  constructor() {
    super(UserSchema)
  }
}

Object.seal(UserRepository)
export default UserRepository
