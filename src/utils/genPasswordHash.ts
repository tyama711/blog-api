import { hashSync } from "bcrypt";

const saltRounds = 10;
const password = "write password here";

const hash = hashSync(password, saltRounds);

console.log(hash);
