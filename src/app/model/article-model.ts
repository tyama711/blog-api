import IArticleModel from "./interfaces/article-model";

class ArticleModel {
  private _articleModel: IArticleModel;

  constructor(articleModel: IArticleModel) {
    this._articleModel = articleModel;
  }

  get id() {
    return this._articleModel.id;
  }

  get userId() {
    return this._articleModel.userId;
  }

  get createDate() {
    return this._articleModel.createDate;
  }

  get updateDate() {
    return this._articleModel.updateDate;
  }

  get title() {
    return this._articleModel.title;
  }

  get abstract() {
    return this._articleModel.abstract;
  }

  get content() {
    return this._articleModel.content;
  }
}

Object.seal(ArticleModel);
export default ArticleModel;
