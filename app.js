const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");

const { render } = require("ejs");
const blogRoutes = require("./routes/blogRoutes");

const dbiURI = process.env.MONGO_URI;

mongoose
  .connect(dbiURI)
  .then((result) =>
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    })
  )
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/blogs");
  //res.render('index', {title: 'Home', blogs});
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//blog routes
app.use("/blogs", blogRoutes);

//404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
