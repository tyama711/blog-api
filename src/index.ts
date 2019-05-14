import Koa from "koa";
import http from "http";
import session from "koa-session";

import Middlewares from "./config/middlewares";
import Db from "./app/data-access/db";
import Constants from "./config/constants";
import Authenticator from "./auth";

Db.connect(Constants.DB_CONNECTION_STRING);
Authenticator.initialize();

const app = new Koa();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const errorHandler: Koa.Middleware<Koa.Context> = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { ok: false, message: err.message };
    app.emit("error", err, ctx);
  }
};
app.use(errorHandler);

app.keys = ["secret key"];
app.use(session({}, app));

app.use(Middlewares.configuration());

app.on("error", (err, ctx) => {
  /* centralized error handling:
   *   console.log error
   *   write error to log file
   *   save error and request information to database if ctx.request match condition
   *   ...
   */
  console.log("err = ", err);
  console.log("ctx = ", ctx);
});

let server: http.Server;
if (process.env.NODE_ENV === "test") {
  server = app.listen();
} else {
  server = app.listen(port, () => {
    console.log("Node app is running at localhost:" + port);
  });
}

server.on("close", () => {
  Db.disconnect();
});

export default server;
