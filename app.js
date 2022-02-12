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
  var { name } = req.query;

  if ((name !== undefined) & (name !== "")) {
    //find by name
    const data = await Visitor.updateOne(
      { name: name },
      { $inc: { count: 1 } }
    );
    //modifiedcount=1 => se actualizó ==0 entonces no
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

app.listen(3000, () => console.log("Listening on port 3000!!!"));

/* res.send(
  
); */
