
/**
 * Module dependencies.
 */

var express = require('express');   
var session = require('express-session');
var cookieParser = require('cookie-parser');

var routes = require('./routes');
var http = require('http');
var path = require('path');

var users = require('./routes/users');
//load customers route
var customers = require('./routes/customers');
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
app.use(
    connection(mysql,{
        host: 'localhost' , // 'mysql://mysql:3306/', //'localhost',
        user: 'root',
        password : 'se2121',
        port : 3306, //port mysql
        database:'node_mysql'

    },'pool') //or single
);

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});
// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    console.log(req.session);
    console.log(req.cookies.user_sid);
    if (req.session.user_id && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};
// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user_id && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});

// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    // console.log(req.session);
    req.session.user_id = 'dfsdf';
    // console.log(req.session);
});

// app.get('/', routes.index);
app.get('/login', users.login);
app.post('/loginCheck', users.loginCheck);
app.get('/customers', sessionChecker, customers.list);
app.get('/customers/add', customers.add);
app.post('/customers/add', customers.save);
app.get('/customers/delete/:id', customers.delete_customer);
app.get('/customers/edit/:id', customers.edit);
app.post('/customers/edit/:id',customers.save_edit);


app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
