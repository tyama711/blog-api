import IArticleModel from "../model/interfaces/article-model";
import ArticleSchema from "../data-access/schemas/article-schema";
import RepositoryBase from "./base/repository-base";

class ArticleRepository extends RepositoryBase<IArticleModel> {
  constructor() {
    super(ArticleSchema);
  }
}

Object.seal(ArticleRepository);
export default ArticleRepository;
