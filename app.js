require("dotenv").config();
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

//Load User
require("./models/user");

//Load Passport Module
require("./config/passport")(passport);

//Load auth Routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const storiesRoutes = require("./routes/stories");
// MLAB CONFIG
var uri = process.env.DBLOGIN;

mongoose
  .connect(uri)
  .then(() => console.log("Db Connected"))
  .catch(err => console.log(err));

mongoose.Promise = global.Promise;

//HANDLEBARS MIDDLEWARE
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//STATIC PARSER
var dir = path.join(__dirname, "/public");
app.use(express.static(dir));

app.use(methodOverride("_method"));

//BODY PARSER MIDDLEWARE
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  require("express-session")({
    secret: "Nellie is a baby girl",
    resave: false,
    saveUninitialized: false
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//FLASH MESSAGING
app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/stories", storiesRoutes);

//=====================================================================

// app.listen(process.env.PORT, process.env.IP || 5000, () => {
//   console.log("The StoryBook Server Has Started Port 5000!");
// });

app.listen(5000 || process.env.PORT, process.env.IP, () => {
  console.log("The StoryBook Server Has Started Port 5000!");
});
