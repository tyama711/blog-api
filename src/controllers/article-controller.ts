import Koa from 'koa'
import ArticleBusiness from '../app/business/article-business'
import IBaseController from './interfaces/base/base-controller'
import IArticleModel from '../app/model/interfaces/article-model'
import staticImplements from '../utils/static-implements'

@staticImplements<IBaseController>()
export default class ArticleController {
  public static async create(ctx: Koa.Context) {
    if (ctx.session === null || !ctx.isAuthenticated()) {
      ctx.throw(401)
    } else {
      const article: IArticleModel = ctx.request.body as IArticleModel
      article.userId = ctx.session.passport.user

      const articleBusiness = new ArticleBusiness()
      const result = await articleBusiness.create(article)

      ctx.body = { ok: true, _id: result._id }
    }
  }

  public static async update(ctx: Koa.Context) {
    if (ctx.isUnauthenticated()) {
      ctx.throw(401)
    }
    if (ctx.session === null) {
      ctx.throw(500, 'ctx.session is null.')
    } else {
      const article: IArticleModel = ctx.request.body as IArticleModel
      const _id: string = ctx.params._id
      const articleBusiness = new ArticleBusiness()

      article.userId = ctx.session.passport.user
      const result = await articleBusiness.update(_id, article)
      if (result !== null) {
        ctx.body = { ok: true }
      } else {
        ctx.throw(404)
      }
    }
  }

  public static async delete(ctx: Koa.Context) {
    if (ctx.isUnauthenticated()) {
      ctx.throw(401)
    }
    if (ctx.session === null) {
      ctx.throw(500, 'ctx.session is null.')
    } else {
      const _id: string = ctx.params._id
      const articleBusiness = new ArticleBusiness()
      const result = await articleBusiness.delete(
        _id,
        ctx.session.passport.user
      )
      if (result !== null) {
        ctx.body = { ok: true }
      } else {
        ctx.throw(404)
      }
    }
  }

  public static async retrieve(ctx: Koa.Context) {
    const page = parseInt(ctx.query.page || 1)
    const articleBusiness = new ArticleBusiness()
    const articles = await articleBusiness.retrieve()
    ctx.body = {
      total: articles.length,
      articles: articles.slice((page - 1) * 10, page * 10),
    }
  }

  public static async findOne(ctx: Koa.Context) {
    const _id: string = ctx.params._id
    const articleBusiness = new ArticleBusiness()
    const article = await articleBusiness.findOne({ _id })
    if (article !== null) {
      ctx.body = article
    } else {
      ctx.throw(404, 'Not Found!!!!')
    }
  }
}
