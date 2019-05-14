import Router from "koa-router";
import ArticleController from "../../controllers/article-controller";

const router = new Router<any, any>();
class ArticleRouter {
  private _articleController: ArticleController;

  constructor() {
    this._articleController = new ArticleController();
  }
  get routes() {
    const controller = this._articleController;
    router.get("/", controller.retrieve);
    router.post("/", controller.create);
    router.put("/:_id", controller.update);
    router.get("/:_id", controller.findOne);
    router.delete("/:_id", controller.delete);

    return router.routes();
  }
}

Object.seal(ArticleRouter);
export default ArticleRouter;
