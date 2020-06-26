const express = require("express");
const bodyParser = require("body-parser"); // use for post request so that you can accesss the "req.body"
const mongoose = require("mongoose"); // simply the code instead of using the native driver of mongoDB
const _ = require("lodash"); // to format text // use for express routing usually


const app = express();
// use let instead of var // let is local scope if inside curly brackets // var is only local inside function 
// var is global inside any other curly brackets

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // so that we can target the styles.css file

mongoose.connect("mongodb+srv://admin-jaf:adminjaf@cluster0-ngxtc.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemSchema = ({
  name: String
});

const listSchema = ({
  name: String,
  items: [itemSchema]
});

const Item = mongoose.model("Item", itemSchema); // creating a model and the collection// capital first letter and in singular form // 

const List = mongoose.model("List", listSchema);

//creating new item that will be saved to items collection
const item1 = new Item({
  name: "Sleepsf times"
});

const item2 = new Item({
  name: "Eat Dinners"
});

const item3 = new Item({
  name: "Plays Basketball"
});

// create an array for the items created
const defaultItems = [item1, item2, item3];

app.set("view engine", "ejs"); //ejs - Embedded JavaScript Templating



app.get("/", function (req, res) { //get request to the Home route

  Item.find({}, function (err, items) { // finds all items // returns array of objects
    if (items.length === 0) { // if items is empty
      Item.insertMany(defaultItems, function (err) { //save all items created to the items collection
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted many");
        }
      });
      res.redirect("/"); // we redirect to the home route after the items are added to the database/ since length now of the items array will not be zero, it will display now the items
    } else {
      // it will go to list.ejs with the listTitle and all of the items in the home route
      res.render("list", { listTitle: "Today", works: items });// show the lissTitle and the items on the list.ejs page
    }
  });
});



app.post("/", function (req, res) { //post request to the Home route
  const itemName = req.body.work; // data comes from the input type text with name work in list.ejs file
  const listName = req.body.list; // the value on the button that is in the list.ejs

  const item = new Item({ // create new item
    name: itemName
  });

  if (listName === "Today") { //if its the home page
    item.save();  //save the item
    res.redirect("/"); // get request to the home route
  } else {
    // returns just one list, an object, using the name of the list 
    List.findOne({ name: listName }, function (err, foundList) { // foundList here is the list object that was found using the findOne method
      foundList.items.push(item); // add the new item to the list 
      foundList.save(); // save the list to the list collection
      res.redirect("/" + listName); // will be routed "/name of the list" 
    });
  }
});



app.post("/delete", function (req, res) { // post request to "/delete"
  const checkedItemId = req.body.checkBox; // the value of the id, when the checkbox is checked in hte list.ejs page
  const listName = req.body.listName; // the value of the input type hidden, we put the value of the listTitle here from the list.ejs page

  if (listName === "Today") { // if it is the home page
    Item.findByIdAndRemove(checkedItemId, function (err) { // finds the id of the item that got checked in the list.ejs page, and delete it
      if (!err) {
        console.log("Deleted!");
      } else {
        console.log(err);
      }
      res.redirect("/");

    });
  } else { // if other routes aside from the home route
    //finds the list, an object, using the name, and then it will get the items associated with the list that was found, and look for the specific id of the item, and delete that item with that id that was found
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) { // foundList here is the list object found
      if (!err) {
        res.redirect("/" + listName);  // will be routed "/name of the list" 
      }
    });
  }
});



app.get("/:customListName", function (req, res) { // express routing 
  const customListName = _.capitalize(req.params.customListName); // the name of the route after the "/"
  //finds just one list, and object using name, should be equal to the name of the route after "/".
  List.findOne({ name: customListName }, function (err, foundList) { // foundList here is the list, an object that was found
    if (!err) {
      if (!foundList) { // if the route is not yet created 
        //create a new list
        const list = new List({ // add new list or the new route that is not created yet
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //show an existing list
        res.render("list", { listTitle: foundList.name, works: foundList.items });
      }
    }
  });
  // res.render("list", { listTitle: page.toUpperCase(), works: [] });
})



app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
