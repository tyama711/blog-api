import Router from "koa-router";
import AuthController from "../../controllers/auth-controller";

const router = new Router<any, any>();
class AuthRouter {
  private _authController: AuthController;

  constructor() {
    this._authController = new AuthController();
  }
  get routes() {
    const controller = this._authController;
    router.post("/login", controller.login);
    router.get("/logout", controller.logout);

    return router.routes();
  }
}

Object.seal(AuthRouter);
export default AuthRouter;
