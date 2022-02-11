const { model, Schema } = require("mongoose");

// Schema definition
var userSchema = Schema({
  date: String,
  name: String,
});

var User = model("User", userSchema);
module.exports = User;
