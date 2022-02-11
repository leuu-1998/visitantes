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
  var { name } = req.query;

  if ((name !== undefined) & (name !== "")) {
    //find by name
    Visitor.updateOne(
      { name: name },
      { $inc: { count: 1 } },
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("se actuzalizó un usuario");
        }
        if (data.modifiedCount === 0) {
          Visitor.create({ name: name }, function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    );
  } else {
    name = "Anónimo";
    Visitor.create({ name: name }, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }

  // call all the collection
  Visitor.find({}, function (err, visitors) {
    res.send(
      `<div>
          <table>
            <tr>
              <td><strong>Id</strong></td>
              <td><strong>Name</strong></td>
              <td><strong>Visits</strong></td>
            </tr>
            ${visitors.map(
              (oneVisitor) =>
                `<tr><td>${oneVisitor._id}</td><td>${oneVisitor.name}</td><td>${oneVisitor.count}</td></tr>`
            )}
          </table>
        </div>
      `
    );
  });
});

app.listen(3000, () => console.log("Listening on port 3000!!!"));
