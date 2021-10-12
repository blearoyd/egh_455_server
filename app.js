var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const io = require('socket.io')(5001)


let enviroRouter = require('./routes/enviroment');
const { Socket } = require('socket.io');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('../web_interface/build'))

app.use('/enviroment', enviroRouter)

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

app.use((req, res) => {
   res.sendFile(path.join(__dirname, '../web_interface/build/index.html'));
})

io.on('connection', socket => {
  console.log(socket.id)
  io.fetchSockets()
  .then(res => console.log(res.length))
  
  socket.on('select-lcd-display', (message) => {
    console.log(message)
    io.emit('lcd_config', message)
  })

  socket.on('recv', (message) => {
    console.log(message)
  })
})



module.exports = app;
