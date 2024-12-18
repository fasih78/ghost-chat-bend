const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require('passport')
const session = require('express-session');
const cors = require("cors");




app.use(session({
  secret: 'FMS', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());


const user_routes = require('./src/user-auth/user.route')
const googleroutes = require('./src/google-auth/google_auth_routes')
const rateLimitMiddleware = require('./src/helper/http-request-limit');
const emailValidateMiddleware = require('./src/helper/email-validator');
require('dotenv').config()



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(rateLimitMiddleware)
// app.use(emailValidateMiddleware)
app.use('/user', user_routes)
app.use('/', googleroutes)

function checkExternalServiceStatus() {

  return Math.random() < 0.8;
}
// app.get('/status', (req, res) => {

//   const isServiceUp = checkExternalServiceStatus();

//   if (isServiceUp) {
//     res.json({ status: 'up' });
//   } else {
//     res.json({ status: 'down' });
//   }
// });












module.exports = app;