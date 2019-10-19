import Router from 'koa-router'
import AuthController from '../../controllers/auth-controller'

const router = new Router<any, any>()
class AuthRouter {
  get routes() {
    router.post('/login', AuthController.login)
    router.get('/logout', AuthController.logout)

    return router.routes()
  }
}

Object.seal(AuthRouter)
export default AuthRouter
