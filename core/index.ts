import Promise = require("bluebird");
import express = require("express");
import { viewRouter, apiRouter } from "./api";
import fs = require("fs");
import path = require("path");

var Mustache = require("mustache");

const port = 2345;
const app = express();

function nmlCore(): Promise<number> {
  return new Promise((resolve, reject) => {
    app.engine(
      "html",
      (filePath: string, options: Object, callback: Function) => {
        fs.readFile(filePath, (err, content) => {
          if (err) return callback(err);
          var rendered = Mustache.to_html(content.toString(), options);
          return callback(null, rendered);
        });
      }
    );

    app.set("views", path.join(__dirname, "../", "views"));
    app.set("view engine", "html");

    //set up routes and middleware

    app.use("/", viewRouter);
    app.use("/api", apiRouter);

    //initialize server and resolve promise with listened port
    app.listen(port, () => resolve(port));
  });
}

export default nmlCore;
