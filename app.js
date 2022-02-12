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
  //  query string recived
  var { name } = req.query;

  if ((name !== undefined) & (name !== "")) {
    //find by name
    const data = await Visitor.updateOne(
      { name: name },
      { $inc: { count: 1 } }
    );
    //if not update a visitor then we have to create a new visitor
    if (data.modifiedCount === 0) {
      try {
        await Visitor.create({ name: name });
      } catch (e) {
        console.error(e);
      }
    }
  } else {
    try {
      name = "Anónimo";
      await Visitor.create({ name: name });
    } catch (e) {
      console.error(e);
    }
  }

  // then get all the collection
  const visitors = await Visitor.find({});
  res.send(
    `
      <table>
        <thead>
          <tr>
            <th><strong>Id</strong></th>
            <th><strong>Name</strong></th>
            <th><strong>Visits</strong></th>
          </tr>
        </thead>
        <tbody>
          ${visitors.map(
            (oneVisitor) =>
              `<tr><td>${oneVisitor._id}</td><td>${oneVisitor.name}</td><td>${oneVisitor.count}</td></tr>`
          )}
        </tbody>
      </table>
    `
  );
});

app.listen(3000, () => console.log("Listening on port 3000!!!"));
