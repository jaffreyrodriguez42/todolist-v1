const express = require("express");
const bodyParser = require("body-parser");

const app = express();
var works = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs"); //ejs - Embedded JavaScript Templating

app.get("/", function (req, res) {
  var today = new Date();

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  var day = today.toLocaleDateString("en-US", options);

  res.render("list", { kindOfDay: day, works: works });
});

app.post("/", function (req, res) {
  var work = req.body.work;
  works.push(work);
  res.redirect("/");
  // console.log(work);
  // res.render("list", { work: work });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
