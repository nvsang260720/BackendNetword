require('dotenv').config()
const createError = require('http-errors');
var express = require ('express');
var moment = require('moment');
const path = require('path');
const expressLayouts = require('express-ejs-layouts')
const logger = require('morgan');
var bodyParser = require('body-parser');

const verifyToken = require('./middleware/auth')

//router backend
const userRouter = require('./routes/backend/user')
const adminRouter = require('./routes/backend/admin');
const homeRouter = require('./routes/frontend/home')

//api 
const API = require('./routes/api/API');
const ApiAuth = require('./routes/api/Auth');
const ApiUser = require('./routes/api/User');
const ApiProduct = require('./routes/api/Product')
const ApiCategory = require('./routes/api/Category')

const connectDB = require('./database/connectDB')
connectDB()
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true,}));
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));
app.use('/stylesheets', express.static(__dirname + 'public/stylesheets'));
app.use('/vendor', express.static(__dirname + 'public/vendor'));
app.use('/uploads', express.static( __dirname +'public/uploads'));

app.use('/', homeRouter);
app.use('/admin', adminRouter);
app.use('/admin/user', userRouter);

//api ApiCategory
app.use('/api', API);
app.use('/api/auth', ApiAuth);
app.use('/api/category', ApiCategory);
app.use('/api/product', ApiProduct);
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