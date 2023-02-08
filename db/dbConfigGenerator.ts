import * as fs from "fs";
import config from "../config";

const argPath = process.argv[2];
const path = `./build/${argPath}/mongo-init.js`;

if (fs.existsSync(path)) {
  if (fs.statSync(path).isDirectory()) {
    fs.rmdirSync(path);
  } else {
    fs.unlinkSync(path);
  }
}

fs.writeFileSync(
  path,
  `db.createUser({
    user: "${config.mongo.MONGO_USER}",
    pwd: "${config.mongo.MONGO_PW}",
    roles: [
      {
        role: "readWrite",
        db: "${config.mongo.MONGO_DBNAME}",
      },
    ],
  });`
);

export {};
