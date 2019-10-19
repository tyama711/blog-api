const constants: { [key: string]: string } = {
  DB_CONNECTION_STRING: process.env.DB_URL || '',
  FRONT_SERVER_ORIGIN: process.env.FRONT_SERVER_ORIGIN || '',
}

class Constants {
  public static get DB_CONNECTION_STRING() {
    return constants.DB_CONNECTION_STRING
  }

  public static get FRONT_SERVER_ORIGIN() {
    return constants.FRONT_SERVER_ORIGIN
  }
}

Object.freeze(Constants)
export default Constants
