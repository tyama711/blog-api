import Router from 'koa-router'
import ArticleController from '../../controllers/article-controller'

const router = new Router<any, any>()
class ArticleRouter {
  get routes() {
    router.get('/', ArticleController.retrieve)
    router.post('/', ArticleController.create)
    router.put('/:_id', ArticleController.update)
    router.get('/:_id', ArticleController.findOne)
    router.delete('/:_id', ArticleController.delete)

    return router.routes()
  }
}

Object.seal(ArticleRouter)
export default ArticleRouter
