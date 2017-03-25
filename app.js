var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var pgp = require('pg-promise')({  });
const config = {
    user: 'postgres', //env var: PGUSER
    database: 'todo', //env var: PGDATABASE
    password: null, //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};
// end config
//connect database with configuration
var db = pgp(config);


var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();
// var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);


app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//////
// find a user function


/////////
passport.use( 'local', new LocalStrategy(
    function(username, password, done) {
        var user = {username: username, password: password};
        ///query database to find user
        db.query('select email, password from public.users').then(function(data){
            // console.log('data ', data);
            //for loop to find user
            for(var i=0; i<data.length;i++){
                if(data[i].email == username && data[i].password == password) {
                    return done(null, user);
                }
            }

            return done(null, false, {message: 'Incorrect username or password.'});

        });

    }
));

// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});



////authentication
app.post('/login', passport.authenticate('local'), function(req, res){
    // console.log('req ', req.user);
    // console.log('is authenticated ', req.isAuthenticated());
    // authenticate = req.isAuthenticated();

    // res.redirect('/home');
    // res.send(req.user);
    res.json(req.user);




});



app.get('/home',  function(req, res){
    console.log('is authenticated ', req.isAuthenticated());

    var authenticate = req.isAuthenticated();
    // console.log('true');
    if(authenticate){
        console.log('user ',req.user);
        // res.render('index', );
        res.sendfile('views/index.html');

    }
    else {
        res.sendfile('public/src/public/signup/signup.html');
    }

});




module.exports = app;