var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminHomeRouter = require('./routes/adminHome');
var adminMagangRouter = require('./routes/adminMagang');
var adminMagangAssignmentsRouter = require('./routes/adminMagangAssignments')(upload);
var adminMagangAbsensiRouter = require('./routes/adminMagangAbsensi');
var adminPenilaianRouter = require('./routes/adminPenilaian');
var adminPenilaianPembobotanRouter = require('./routes/adminPenilaianPembobotan');
var adminPenilaianKalkulasiRouter = require('./routes/adminPenilaianKalkulasi');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/adminHome', adminHomeRouter);
app.use('/adminMagang', adminMagangRouter);
app.use('/adminMagangAssignments', adminMagangAssignmentsRouter);
app.use('/adminMagangAbsensi', adminMagangAbsensiRouter);
app.use('/adminPenilaian', adminPenilaianRouter);
app.use('/adminPenilaianPembobotan', adminPenilaianPembobotanRouter);
app.use('/adminPenilaianKalkulasi', adminPenilaianKalkulasiRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
