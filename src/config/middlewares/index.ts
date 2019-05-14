import Koa = require("koa");
import compose = require("koa-compose");
import koaLogger = require("koa-logger");
import cors = require("@koa/cors");
import bodyParser = require("koa-bodyparser");
import passport from "koa-passport";

import RootRouter from "../router";
import Constants from "../constants";

class RootMiddleware {
  static configuration = () => {
    // const errorHandler: Koa.Middleware<Koa.Context> = async (ctx, next) => {
    //   try {
    //     await next();
    //   } catch (err) {
    //     console.log(JSON.stringify(err));
    //     ctx.status = err.status || 500;
    //     ctx.body = { ok: false, message: err.message };
    //     ctx.emit("error", err, ctx);
    //   }
    // };

    const corsMiddleware = cors({
      origin: Constants.FRONT_SERVER_ORIGIN,
      allowMethods: ["GET"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Length", "Date", "X-Request-Id"]
    });

    const middlewares = [
      koaLogger(),
      // errorHandler,
      corsMiddleware,
      bodyParser(),
      passport.initialize(),
      passport.session(),
      new RootRouter().routes as Koa.Middleware
    ];
    return compose(middlewares);
  };
}
Object.seal(RootMiddleware);
export default RootMiddleware;
