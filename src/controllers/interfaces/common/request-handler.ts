import Koa from "koa";

export default interface RequestHandler {
  (ctx: Koa.Context): Promise<any>;
}
