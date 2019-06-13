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
    const corsMiddleware = cors({
      origin: Constants.FRONT_SERVER_ORIGIN,
      allowMethods: ["GET"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Length", "Date", "X-Request-Id"],
      credentials: true
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
