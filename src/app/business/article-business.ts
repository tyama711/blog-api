import ArticleRepository from "../repository/article-repository";
import IArticleBusiness from "./interfaces/article-business";
import IArticleModel from "../model/interfaces/article-model";

class ArticleBusiness implements IArticleBusiness {
  private _articleRepository: ArticleRepository;

  constructor() {
    this._articleRepository = new ArticleRepository();
  }

  async create(item: IArticleModel) {
    item.createDate = new Date();
    return await this._articleRepository.create(item);
  }

  async retrieve() {
    return await this._articleRepository.retrieve(
      { content: 0, __v: 0 },
      { createDate: -1 }
    );
  }

  async update(_id: string, item: IArticleModel) {
    const article = await this.findOne({ _id });
    if (article === null) {
      throw new Error();
    } else if (article.userId !== item.userId) {
      throw new Error();
    } else {
      item.updateDate = new Date();
      return await this._articleRepository.update(_id, item);
    }
  }

  async delete(_id: string, username: string) {
    const article = await this.findOne({ _id });
    if (article === null) {
      throw new Error();
    } else if (article.userId !== username) {
      throw new Error();
    } else {
      return await this._articleRepository.delete(_id);
    }
  }

  async findOne(conditions: Partial<IArticleModel>) {
    return await this._articleRepository.findOne(conditions);
  }
}

Object.seal(ArticleBusiness);
export default ArticleBusiness;
