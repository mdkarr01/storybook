const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

// Load Models
require("./models/User");
require("./models/Story");

// Passport Config
require("./config/passport")(passport);

// Load Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");

// MLAB CONFIG
const uri = process.env.DBLOGIN;

mongoose
  .connect(uri)
  .then(() => console.log("Db Connected"))
  .catch(err => console.log(err));

mongoose.Promise = global.Promise;

// Load Keys
// const keys = require("./config/keys");

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require("./helpers/hbs");

const app = express();

// Body Parser Middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// MEthod Override Middelware
app.use(methodOverride("_method"));

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    helpers: {
      truncate: truncate,
      stripTags: stripTags,
      formatDate: formatDate,
      select: select,
      editIcon: editIcon
    },
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Use Routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);

//=====================================================================

app.listen(process.env.PORT, process.env.IP, () => {
  console.log("The SB Server Has Started Port 5000!");
});

// app.listen(5000 || process.env.PORT, process.env.IP, () => {
//   console.log("The StoryBook Server Has Started Port 5000!");
// });
