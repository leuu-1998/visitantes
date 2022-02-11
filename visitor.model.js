const { model, Schema } = require("mongoose");

// Schema definition
var userSchema = Schema({
  date: String,
  name: String,
});

var Visitor = model("Visitor", userSchema);
module.exports = Visitor;
