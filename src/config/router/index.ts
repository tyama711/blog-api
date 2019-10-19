import Router from 'koa-router'
import ArticleRouter from './article-router'
import AuthRouter from './auth-router'

const router = new Router()
export default class RootRouter {
  get routes() {
    router
      .use('/auth', new AuthRouter().routes)
      .use('/articles', new ArticleRouter().routes)
    return router.routes()
  }
}
