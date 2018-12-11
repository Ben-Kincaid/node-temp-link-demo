// Entry File for Express/Node Server
import express = require("express");
import nmlCore from "./core";

nmlCore().then(port => {
  console.log("SERVER RUNNING ON PORT " + port);
});
