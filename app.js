require('dotenv').config()
var createError = require('http-errors');
var express = require ('express');
var path = require('path');
var expressLayouts = require('express-ejs-layouts')
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var multer = require('multer');
var upload = multer();
var session = require('express-session')

const verifyToken = require('./middleware/auth')
const checkLogin = require('./middleware/checkLogin')

//router backend
const authRouter = require('./routes/backend/auth')
const userRouter = require('./routes/backend/user')
const adminRouter = require('./routes/backend/admin');

//router frontend
const homeRouter = require('./routes/frontend/home')

//api 
const API = require('./routes/api/API');
const ApiAuth = require('./routes/api/Auth');
const ApiUser = require('./routes/api/User');
const connectDB = require('./utils/connectDB')
connectDB()

const app = express();

app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'session_secret',
  resave: true,
  saveUninitialized: false,
}))

app.use(logger('dev'));
// for parsing application/json
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'))


app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/stylesheets', express.static(__dirname + 'public/stylesheets'));
app.use('/vendor', express.static(__dirname + 'public/vendor'));
app.use('/uploads', express.static( __dirname +'public/uploads'));

app.use('/', homeRouter);
app.use('/auth/', authRouter);
app.use('/admin',checkLogin, adminRouter);
app.use('/admin/user',checkLogin, userRouter);

//api ApiCategory
app.use('/api', API);
app.use('/api/auth', ApiAuth);
app.use('/api/user',verifyToken, ApiUser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;