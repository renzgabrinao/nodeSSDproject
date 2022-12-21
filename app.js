"use strict";

//MongoDB connection setup
const { mongoose } = require("mongoose");
const uri = "mongodb+srv://renzgabrinao02:GzcnSXrcKZ7USXJp@ssd-0mac.uolltgf.mongodb.net/test"
  
// set up default mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// store a reference to the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Log once we have a connection to Atlas
db.once("open", function () {
    console.log("Connected to Mongo");
});

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const passport = require("passport")
const LocalStrategy = require("passport-local");

const app = express();

// allow cross origin requests from any port on local machine
app.use(cors({ origin: [/127.0.0.1*/, /localhost*/] }));

// log all http requests
app.use(logger("dev"));

// use file upload middleware
app.use(fileUpload());

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up session management
app.use(
    require("express-session")({
      secret: "a long time ago in a galaxy far far away",
      resave: false,
      saveUninitialized: false,
    })
  );

// Initialize passport and configure for User model
app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/User");
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use express.static middleware to make the public folder accessible
app.use(express.static("public"));
// Enable layouts
app.use(expressLayouts);
// Tell express that we'll be using the EJS templating engine
app.set("view engine", "ejs");
// Set the default layout
app.set("layout", "./layouts/main-layout");
// Make views folder globally accessible
app.set("views", path.join(__dirname, "views"));

// index routes
const indexRouter = require("./routers/indexRouter");
app.use(indexRouter);
// User routes
const userRouter = require("./routers/userRouter");
app.use("/user", userRouter);
// Secure routes
const secureRouter = require("./routers/secureRouter");
app.use("/secure", secureRouter);

// handle unrecognized routes
app.get("*", function (req, res) {
    res.status(404).send('<h2 class="error">File Not Found</h2>');
});   

// start listening
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
