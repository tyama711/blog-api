import mongoose from "mongoose";
import IRead from "../interfaces/base/Read";
import IWrite from "../interfaces/base/Write";

export default class RepositoryBase<T extends mongoose.Document>
  implements IRead<T>, IWrite<T> {
  private _model: mongoose.Model<T>;

  constructor(schemaModel: mongoose.Model<T>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<T> {
    return await this._model.create(item);
  }

  async retrieve(projection?: any, sort?: any): Promise<T[]> {
    return await this._model.find({}, projection).sort(sort);
  }

  async update(_id: string, item: T): Promise<T | null> {
    return await this._model.findOneAndUpdate(
      { _id: this.toObjectId(_id) },
      item
    );
  }

  async delete(_id: string): Promise<T | null> {
    return await this._model.findOneAndDelete({ _id: this.toObjectId(_id) });
  }

  async findOne(conditions: Partial<T>, projection?: any) {
    return await this._model.findOne(conditions, projection);
  }

  private toObjectId(_id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(_id);
  }
}
