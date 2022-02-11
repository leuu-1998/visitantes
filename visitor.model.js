const { model, Schema } = require("mongoose");

// Schema definition
var userSchema = Schema({
  date: { type: Date, default: Date.now },
  name: { type: String },
});

var Visitor = model("Visitor", userSchema);
module.exports = Visitor;
