import mongoose from "mongoose";

const MAX_RETRY = 5;

export default class Db {
  static retryCount = 0;

  public static connect(db: string) {
    const connect = () => {
      mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false });
    };

    const errorHandler = (err: any) => {
      // If first connect fails because mongod is down, try again later.
      // This is only needed for first connect, not for runtime reconnects.
      // See: https://github.com/Automattic/mongoose/issues/5169
      Db.retryCount += 1;
      if (
        err.message &&
        err.message.match(/failed to connect to server .* on first connect/) &&
        Db.retryCount <= MAX_RETRY
      ) {
        console.log(new Date(), String(err));

        // Wait for a bit, then try to connect again
        setTimeout(() => {
          console.log(
            `Retrying first connect... retryCount === ${Db.retryCount}`
          );
          connect();
        }, 1 * 1000);
      } else {
        // Some other error occurred.  Log it.
        console.error(new Date(), String(err));
        process.exit(1);
      }
    };

    connect();

    mongoose.connection.on("error", errorHandler);

    mongoose.connection.once("open", () => {
      console.log("Connection to db established.");
    });

    mongoose.connection.on("open", () => {
      Db.retryCount = 0;
    });
  }

  public static disconnect() {
    mongoose.disconnect();
  }
}
