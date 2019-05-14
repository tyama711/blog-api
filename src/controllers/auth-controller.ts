import Koa from "koa";
import passport from "koa-passport";

export default class AuthController {
  public login(ctx: Koa.Context, next: () => Promise<any>) {
    return passport.authenticate("local", (err, user) => {
      if (!user) {
        ctx.throw(401, err);
      } else {
        ctx.body = user;
        return ctx.login(user);
      }
    })(ctx, next);
  }

  public logout(ctx: Koa.Context) {
    ctx.logout();
    ctx.body = {};
  }
}
