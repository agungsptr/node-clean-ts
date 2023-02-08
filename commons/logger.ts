import * as winston from "winston";
import moment from "moment";

function createLogger() {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.colorize(),
      winston.format.printf((log) => {
        if (log.stack) return `[${log.timestamp}] ${log.stack}`;
        return `[${log.timestamp}] ${log.message}`;
      })
    ),
    transports: [
      new winston.transports.File({
        level: "silly",
        filename: `logs/app/${moment().format("YYYY/MM/DD")}.log`,
      }),
    ],
  });
}

export { createLogger };
