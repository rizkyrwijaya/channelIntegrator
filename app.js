var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var passport = require("passport");
var OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
var hbs = require("express-handlebars");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dataRouter = require("./routes/data");

var app = express();

const TWITCH_CLIENT_ID = "bj25s130tkb171z59dtgxbk2jdrie3";
const TWITCH_SECRET = "48uugnkh6c170raofzbyan46tl7knd";
const SESSION_SECRET = "asdasdasd2432423r23ddasdas";
const CALLBACK_URL = "http://localhost:3000/auth/twitch/callback";

//Set Up view engine
app.set('view engine','hbs');

app.engine('hbs', hbs({
  extname:'hbs',
  defaultView: 'default',
  layoutsDir: __dirname + 'views/layouts/',
  partialsDir: __dirname + 'views/partials'
}));

app.use(logger("dev"));
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  var options = {
    url: "https://api.twitch.tv/helix/users",
    method: "GET",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      Accept: "application/vnd.twitchtv.v5+json",
      Authorization: "Bearer " + accessToken
    }
  };

  request(options, function(error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
};


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

    // Securely store user profile in your DB
    //User.findOrCreate(..., function(err, user) {
    //  done(err, user);
    //});

    done(null, profile);
  }
));

app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));

app.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/data", dataRouter);

module.exports = app;
