import Koa from 'koa'
import passport from 'koa-passport'

export default class AuthController {
  public static login(
    ctx: Koa.Context,
    next: () => Promise<void>
  ): Koa.Middleware {
    return passport.authenticate('local', (err, user) => {
      if (!user) {
        ctx.throw(401, err)
      } else {
        ctx.body = user
        return ctx.login(user)
      }
    })(ctx, next)
  }

  public static logout(ctx: Koa.Context): void {
    ctx.logout()
    ctx.body = {}
  }
}
