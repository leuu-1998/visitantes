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

  //find by id
  Visitor.updateOne(
    { name: name },
    { $inc: { count: 1 } },
    async function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("se actuzalizó un usuario");
      }
      if (data.modifiedCount === 0) {
        const visitor = new Visitor({ name: name || "Anónimo" });
        await visitor.save();
      }
    }
  );

  // call all the collection
  Visitor.find({}, function (err, visitors) {
    res.send(
      `
          <table>
            <tr>
              <td><strong>Id</strong></td>
              <td><strong>Name</strong></td>
              <td><strong>Visits</strong></td>
            </tr>
            ${visitors.map(
              (visitor) =>
                `<tr><td>${visitor._id}</td><td>${visitor.name}</td><td>${visitor.count}</td></tr>`
            )}
          </table>
      `
    );
  });
});

app.listen(3000, () => console.log("Listening on port 3000!!!"));
