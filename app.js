var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var logger          = require('morgan');
var session         = require('express-session');
var passport        = require('passport');
var OAuth2Strategy  = require('passport-oauth').OAuth2Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter  = require('./routes/data');

var app = express();

const TWITCH_CLIENT_ID = 'bj25s130tkb171z59dtgxbk2jdrie3';
const TWITCH_SECRET    = '48uugnkh6c170raofzbyan46tl7knd';
const SESSION_SECRET   = 'asdasdasd2432423r23ddasdas';
const CALLBACK_URL     = 'http://localhost:3000/auth/twitch/callback';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);

module.exports = app;
