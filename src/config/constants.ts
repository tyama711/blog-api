const constantSets: { [key: string]: any } = {
  base: {
    DB_CONNECTION_STRING: "mongodb://localhost:27017/blog-db",
    FRONT_SERVER_ORIGIN: "http://localhost:3000"
  },
  development: {},
  production: {},
  test: {
    DB_CONNECTION_STRING: "mongodb://localhost:27018/blog-db"
  }
};
const env = process.env.NODE_ENV || "development";
const constants = Object.assign(constantSets.base, constantSets[env]);

class Constants {
  public static get DB_CONNECTION_STRING() {
    if (process.env.DB_URL) {
      return process.env.DB_URL;
    } else {
      return constants.DB_CONNECTION_STRING;
    }
  }

  public static get FRONT_SERVER_ORIGIN() {
    return constants.FRONT_SERVER_ORIGIN;
  }
}

Object.freeze(Constants);
export default Constants;
