require("dotenv").config();
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local");

const app = express();

// Load Models
// require("./models/User");
// require("./models/Story");

//Load Passport Module
require("./config/passport")(passport);

// Load Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");

// MLAB CONFIG
var uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => console.log("Db Connected"))
  .catch(err => console.log(err));

mongoose.Promise = global.Promise;

//HANDLEBARS HELPERS
const {
  truncate,
  stripTags,
  formatDate,
  formatDashboardDate,
  select,
  editIcon
} = require("./helpers/hbs");

//HANDLEBARS MIDDLEWARE
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      formatDashboardDate: formatDashboardDate,
      select: select,
      editIcon: editIcon
    },
    defaultLayout: "main",
    secondaryLayout: "home"
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

app.use(expressSanitizer()); // this line follows bodyParser() instantiations

app.use(cookieParser());

app.use(
  require("express-session")({
    secret: "Nellie is a baby girl",
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//FLASH MESSAGING
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Use Routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

//=====================================================================

// app.listen(process.env.PORT, process.env.IP || 5000, () => {
//   console.log("The StoryBook Server Has Started Port 5000!");
// });

app.listen(process.env.PORT, process.env.IP, () => {
  console.log("The StoryBook Server Has Started Port 5000!");
});
