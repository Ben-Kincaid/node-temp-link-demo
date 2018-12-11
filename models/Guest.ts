var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var GuestSchema = new Schema({
  name: String,
  checkInDate: Date,
  expDate: Date,
  linkString: String
});

var GuestModel = mongoose.model("Guest", GuestSchema);
export default GuestModel;
