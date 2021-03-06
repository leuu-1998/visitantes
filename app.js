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
  let htmlVisitors = "";
  for (let i = 0; i < visitors.length; i++) {
    htmlVisitors =
      htmlVisitors +
      "<tr><td>" +
      visitors[i]._id +
      "</td><td>" +
      visitors[i].name +
      "</td><td>" +
      visitors[i].count +
      "</td></tr>";
  }
  res.send(
    "<table><thead><tr><th><strong>Id</strong></th><th><strong>Name</strong></th><th><strong>Visits</strong></th></tr></thead><tbody>" +
      htmlVisitors +
      "</tbody></table>"
  );
});

app.listen(3000, () => console.log("Listening on port 3000!!!"));

//maked it real solution
/* const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });

const VisitorSchema = new mongoose.Schema({
  name: { type: String },
  count: { type: Number, default: 0 }
});
const Visitor = mongoose.model("Visitor", VisitorSchema);

app.set('view engine', 'pug');
app.set('views', 'views');

app.get("/", async (req, res) => {
  const name = req.query.name;

  let visitor;
  if (!name || name.trim().length === 0) {
    visitor = new Visitor({ name: "Anónimo", count: 1 });
  } else {
    visitor = await Visitor.findOne({ name: name });
    if (!visitor) {
      visitor = new Visitor({ name: name, count: 1 });
    } else {
      visitor.count += 1;
    }
  }
  await visitor.save();

  const visitors = await Visitor.find();
  res.render("index", { visitors: visitors })
});

app.listen(3000, () => console.log("Listening on port 3000 ...")); */
