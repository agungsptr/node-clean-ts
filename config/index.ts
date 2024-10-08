import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config();

export default {
  APP_NAME: process.env.APP_NAME,
  APP_PORT: process.env.APP_PORT,
  NODE_ENV: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  rootPath: path.resolve(__dirname, ".."),
  mongo: {
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PW: process.env.MONGO_PW,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_DBNAME: process.env.MONGO_DBNAME,
    MONGO_HOST: process.env.MONGO_HOST,
  },
  bcrypt: {
    salt: Number(process.env.BYCRYPT_SALT) || 10,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expired: process.env.JWT_EXPIRED ?? "24h",
  },
  rateLimit: {
    minute: Number(process.env.RATE_LIMIT_MINUTE) || 15,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },
  GRPC_PORT: process.env.GRPC_PORT,
};
