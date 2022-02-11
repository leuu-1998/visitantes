const { model, Schema } = require("mongoose");

// Schema definition
var userSchema = Schema({
  count: { type: Number, default: 1 },
  name: { type: String },
});

var Visitor = model("Visitor", userSchema);
module.exports = Visitor;
