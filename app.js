const express = require("express");
var mongoose = require("mongoose");
const Visitor = require("./visitor.model");

const app = express();

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/api-test",
  { useNewUrlParser: true }
);
mongoose.connection.on("error", function (e) {
  console.error(e);
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", async (req, res) => {
  // se recibe el query string
  let { name } = req.query;
  //se guarda la información en la base de datos
  const visitor = new Visitor({ name: name || "Anónimo" });
  await visitor.save();

  res.send(`<h1>El visitante fue almacenado con éxito</h1>`);
});

app.listen(3000, () => console.log("Listening on port 3000!!!"));
