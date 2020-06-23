const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");


const app = express();
// use let instead of var // let is local scope if inside curly brackets // var is only local inside function 
// var is global inside any other curly brackets
const works = [];
const workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // so that we can target the styles.css file

app.set("view engine", "ejs"); //ejs - Embedded JavaScript Templating

app.get("/", function (req, res) { //get request to the Home route
  const day = date.getDate();

  res.render("list", { listTitle: day, works: works });// renders to list.ejs page, with the data listTitle: day and works: works
});

app.post("/", function (req, res) { //post request to the Home route
  const work = req.body.work; // data comes from the input type text with name work in list.ejs file
  if (req.body.list === "Work") { // value of the button with name list in the list.ejs file
    workItems.push(work); // push "work" to the workItems array, if button value is "Work"
    res.redirect("/work"); // redirect to "/work" through GET request
  } else { // if the value of button is day of the week, ex "Monday"
    works.push(work); // push "work" to the works array, if button value is the day of the week ex, "Monday"
    res.redirect("/"); // redirect to Home route through GET request
  }

});

app.get("/work", function (req, res) { // get request to the "/work" route
  //renders to list.ejs page with the data listTitle: "Work List" and the worksItems array  
  res.render("list", { listTitle: "Work List", works: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
})

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
