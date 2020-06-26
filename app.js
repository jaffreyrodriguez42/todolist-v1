const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();
// use let instead of var // let is local scope if inside curly brackets // var is only local inside function 
// var is global inside any other curly brackets

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // so that we can target the styles.css file

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = ({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Sleepsf times"
});

const item2 = new Item({
  name: "Eat Dinners"
});

const item3 = new Item({
  name: "Plays Basketball"
});

const defaultItems = [item1, item2, item3];

// Item.deleteMany({}, function (err) {
//   mongoose.connection.close();
// });


app.set("view engine", "ejs"); //ejs - Embedded JavaScript Templating

app.get("/", function (req, res) { //get request to the Home route
  Item.find({}, function (err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted many");
        }
      });
      res.redirect("/"); // we redirect to the home route after the items are added to the database/ since length now of the items array will not be zero, it will display now the items
    } else {
      res.render("list", { listTitle: "Today", works: items });
    }
  });
});

app.post("/", function (req, res) { //post request to the Home route
  const itemName = req.body.work; // data comes from the input type text with name work in list.ejs file
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.get("/work", function (req, res) { // get request to the "/work" route
  //renders to list.ejs page with the data listTitle: "Work List" and the worksItems array  
  res.render("list", { listTitle: "Work List", works: workItems });
});

app.get("/about", function (req, res) {

  res.render("list", { listTitle: "Today", works: items });
})

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
