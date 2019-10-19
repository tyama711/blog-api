import IReadController from './../common/read-controller'
import IWriteController from './../common/write-controller'

export default interface BaseController
  extends IReadController,
    IWriteController {}
