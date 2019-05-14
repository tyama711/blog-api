import IReadController from "./../common/read-controller";
import IWriteController from "./../common/write-controller";
import IBaseBusiness from "../../../app/business/interfaces/base/base-business";
export default interface BaseController<T extends IBaseBusiness<any>>
  extends IReadController,
    IWriteController {}
