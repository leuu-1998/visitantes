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

app.get("/", (req, res) => {
  // se recibe el query string
  let { name } = req.query;

  if (name === undefined || name === "") {
    name = "Anónimo";
  }
  const dateAndHour = new Date();
  const valueDate =
    dateAndHour.toLocaleDateString() + " " + dateAndHour.getHours();
  //se guarda la información en la base de datos
  Visitor.create({ date: valueDate, name: name });
  res.send(`<h1>El visitante fue almacenado con éxito</h1>`);
});

app.listen(3000, () => console.log("Listening on port 3000!!!"));
