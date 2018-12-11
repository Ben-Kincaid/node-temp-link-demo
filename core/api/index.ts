import { RequestHandler } from "express";
import { Router, Request, Response, NextFunction } from "express";
import express = require("express");
import bodyParser = require("body-parser");
import crypto = require("crypto");
var mongoose = require("mongoose");
import Promise = require("bluebird");

import GuestModel from "../../models/Guest";

const mongoDB =
  "mongodb://benk:testpass1@ds217349.mlab.com:17349/node-magiclinks";
const viewRouter = express.Router();
const apiRouter = express.Router();

mongoose.connect(mongoDB);

mongoose.Promise = Promise;

var db = mongoose.connection;

interface GuestObj {
  name: string;
  expDate: Date;
  linkString: string;
}

function handleErr(err: Object) {
  console.log(err);
}
db.on("error", () => {
  console.log("mongo connection err");
});
// middleware that is specific to this router
viewRouter.use(function timeLog(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
viewRouter.get("/", function(req: Request, res: Response) {
  res.render("home", { name: "Benji" });
});

viewRouter.get("/guest/:linkString", function(req: Request, res: Response) {
  GuestModel.find(
    { linkString: req.params.linkString },
    (err: Object, guest: Array<GuestObj>) => {
      if (err) return handleErr(err);
      var currDate = new Date();
      if (guest[0].expDate.getTime() - currDate.getTime() > 0) {
        res.render("templink", {
          name: guest[0].name,
          expDate: guest[0].expDate
        });
      } else {
        res.status(401).send("HTTP 401 - this link has expired.");
      }
    }
  );
});

//API ROUTES (/api/)
apiRouter.use(bodyParser.json());
// define the about route
apiRouter.post("/links/generate", function(req: Request, res: Response) {
  let guestObj = {
    name: req.body.name,
    checkInDate: req.body.signInDate,
    expDate: req.body.expDate,
    linkString: crypto.randomBytes(8).toString("hex")
  };

  var newGuest = new GuestModel(guestObj);
  newGuest.save((err: Object, guest: Object) => {
    if (err) return handleErr(err);
  });
  res.send(JSON.stringify(guestObj));
});

export { viewRouter, apiRouter };
