import fs from "fs";
const fsPromises = fs.promises;
import { format } from "date-fns";
import path from "path";
import { fileURLToPath } from "url";
import { v4 } from "uuid";
const uuid = v4;

//Filename and dirname config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Function to log events
export const logEvents = async (message, logFile) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFile),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

//event logger middleware
export const logger = (req, res, next) => {
  logEvents("reqLog.txt", `${req.method}\t${req.headers.origin}\t${req.url}`);
  next();
};
