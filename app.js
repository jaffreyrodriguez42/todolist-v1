const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// use let instead of var
let works = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // so that we can target the styles.css file

app.set("view engine", "ejs"); //ejs - Embedded JavaScript Templating

app.get("/", function (req, res) {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { kindOfDay: day, works: works });
});

app.post("/", function (req, res) {
  let work = req.body.work;
  works.push(work);
  res.redirect("/");
  // console.log(work);
  // res.render("list", { work: work });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
