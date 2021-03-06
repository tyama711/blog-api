import passport from 'koa-passport'
import passportLocal from 'passport-local'
import { compareSync } from 'bcrypt'
import User from './app/model/interfaces/user-model'
import UserBusiness from './app/business/user-business'

const fetchUser = async (username: string): Promise<User> => {
  const user = await new UserBusiness().findOne({ username })
  if (user === null) {
    throw new Error()
  }
  return user
}

export default class Authenticator {
  public static initialize() {
    passport.serializeUser<User, string>(function(user, done) {
      done(null, user.username)
    })

    passport.deserializeUser<User, string>(async function(username, done) {
      try {
        const user = await fetchUser(username)
        done(null, user)
      } catch (err) {
        done(err)
      }
    })

    const LocalStrategy = passportLocal.Strategy
    passport.use(
      new LocalStrategy(function(username, password, done) {
        fetchUser(username)
          .then(user => {
            if (
              username === user.username &&
              compareSync(password, user.password)
            ) {
              user = user.toObject()
              delete user.password
              done(null, user)
            } else {
              done(null, false)
            }
          })
          .catch(err => done(err))
      })
    )
  }
}
