import Koa from 'koa'
import http from 'http'
import session from 'koa-session'
import koaLogger = require('koa-logger')
import cors = require('@koa/cors')
import bodyParser = require('koa-bodyparser')
import passport from 'koa-passport'

import RootRouter from './config/router'
import Constants from './config/constants'
// import Middlewares from "./config/middlewares";
import Db from './app/data-access/db'
import Authenticator from './auth'

Db.connect(Constants.DB_CONNECTION_STRING)
Authenticator.initialize()

const app = new Koa()
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000

const errorHandler: Koa.Middleware<Koa.Context> = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = { ok: false, message: err.message }
    ctx.app.emit('error', err, ctx)
  }
}

const corsOptions = {
  origin: Constants.FRONT_SERVER_ORIGIN,
  allowMethods: ['GET', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],
  credentials: true,
}

const sessionOptions = {
  maxAge: 24 * 60 * 60 * 1000 /* ms */,
}

app.keys = [process.env.KOA_APP_KEY || 'secret key']

app.use(errorHandler)
app.use(session(sessionOptions, app))
app.use(koaLogger())
app.use(cors(corsOptions))
app.use(bodyParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(new RootRouter().routes as Koa.Middleware)
// app.use(Middlewares.configuration());

app.on('error', (err, ctx: Koa.Context) => {
  /* centralized error handling:
   *   console.log error
   *   write error to log file
   *   save error and request information to database if ctx.request match condition
   *   ...
   */
  console.log('err = ', err)
  console.log('ctx = ', ctx)
})

let server: http.Server
if (process.env.NODE_ENV === 'test') {
  server = app.listen()
} else {
  server = app.listen(port, () => {
    console.log('Node app is running at localhost:' + port)
  })
}

server.on('close', () => {
  Db.disconnect()
})

export default server
