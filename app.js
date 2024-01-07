require("dotenv").config();
const express = require("express");
const uuid = require("uuid");
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
const InitiateMongoServer = require("./dbconfig");
const expressValidator  = require('express-validator'); //npm install express-validator@5.3.0
var session = require('express-session');

const port = process.env.PORT;

InitiateMongoServer.InitiateMongoServer();
uuid.v4();

InitiateMongoServer.transporter;

//router path
var indexRouter = require("./routes/index");
var location = require("./routes/api/address");
var placeDetails = require("./routes/api/place_details");
var placeByAddress = require("./routes/api/placeByAddress");
var codeGeneration = require("./routes/uuid.js");
var sendEmail = require("./routes/sendEmail");
var categories = require("./routes/categories.js");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body Parser Configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('public')));
app.use(expressValidator());

// Session Configs
app.use(session({
    secret: "Change this later",
    resave: false,
    saveUninitialized: true
}));

// Passport Configs
var flash = require('connect-flash');
app.use(flash());

//index router
app.use("/", indexRouter);
app.use("/location",location);
app.use("/placeDetails", placeDetails);
app.use("/placeByAddress", placeByAddress);
app.use("/codeGeneration", codeGeneration);
app.use("/sendEmail", sendEmail);
app.use("/categories", categories);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
});

module.exports = app;