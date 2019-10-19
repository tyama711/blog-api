import { hashSync } from 'bcrypt'

const saltRounds = 10
const password = 'test'

const hash = hashSync(password, saltRounds)

console.log(hash)
