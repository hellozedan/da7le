require("./config.js")
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://admin:sa1234@ds029595.mlab.com:29595/da7le');
var User = require('./models/user');
var Subject = require('./models/subject');
//var Activity = require('./models/activity');
//var Message = require('./models/message');

var routes = require('./routes/index');
var userRouter = require("./routes/userRoutes")(User);
var notificationRouter = require("./routes/notificationRoutes")(User);

var subjectRouter = require("./routes/subjectRoutes")(Subject);
//var activityRouter = require("./routes/activityRoutes")(Activity);
//var messageRouter = require("./routes/messageRoutes")(Message);
var facebookRouter = require("./routes/subjectRoutes")(Subject);
var app = express();
var cors = require('cors');

app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(function(req, res, next) {
//  //console.log('req.body: ' + req.body)
//  //console.log('Loading x-access-token -- begin.');
//  if((req.path === "/api/users") && req.method === "POST"){
//    next();
//  }else {
//
//
//    var token = req.body.token || req.query.token || req.headers['x-token'];
//
//    if (token) {
//      //       console.log('Loading x-access-token -- we have token: ' + token);
//      var query = {};
//      query.token = token;
//
//      User.find(query, function (err, users) {
//        if (err) {
//          //          console.log('Loading x-access-token -- we have an error.');
//          //           console.log(err);
//          return res.status(403).send({
//            success: false,
//            message: 'Wrong token provided.'
//          });
//        } else if (users && users[0]) {
//          //           console.log('Loading x-access-token -- it looks good, username: ' + users[0].firstName + '  ' + users[0].lastName);
//          req.authuser = users[0];
//          next(); // continue to the request handling.
//        } else {
//          //  console.log('Loading x-access-token -- no such token in db.');
//          //   console.log(users);
//          return res.status(403).send({
//            success: false,
//            message: 'Wrong token provided.'
//          });
//        }
//      });
//    } else {
//      // if there is no token
//      // return an error
//      //  console.log('Loading x-access-token -- there is no token in the request.');
//      return res.status(403).send({
//        success: false,
//        message: 'No token provided.'
//      });
//
//    }
//  }
//});
app.use(function (req, res, next) {
	//console.log('req.body: ' + req.body)
	//console.log('Loading x-access-token -- begin.');
	if ((req.path.indexOf("/categories") != -1) || (((req.path === "/api/users") || (req.path === "/api/users/confirm")) && req.method === "POST")) {
		next();
	} else {


		var token = req.headers.token || req.body.token || req.query.token || req.headers['access-token'];

		if (token) {
			//       console.log('Loading x-access-token -- we have token: ' + token);
			var query = {};
			query.token = token;

			User.find(query, function (err, users) {
				if (err) {
					//          console.log('Loading x-access-token -- we have an error.');
					//           console.log(err);
					return res.status(403).send({
						success: false,
						message: 'Wrong token provided.'
					});
				} else if (users && users[0]) {
					//           console.log('Loading x-access-token -- it looks good, username: ' + users[0].firstName + '  ' + users[0].lastName);
					req.authuser = users[0];
					next(); // continue to the request handling.
				} else {
					//  console.log('Loading x-access-token -- no such token in db.');
					//   console.log(users);
					return res.status(403).send({
						success: false,
						message: 'Wrong token provided.'
					});
				}
			});
		} else {
			// if there is no token
			// return an error
			//  console.log('Loading x-access-token -- there is no token in the request.');
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

		}
	}
});
var fbController = require('./controllers/fbController');
app.post('/api/getu/:fbUserToken', function (req, res) {
	console.log('triggered /getu - start getting user data from FB')
	fbController.getUserData(req, req.params.fbUserToken, function (currentBtToken, _id, err) {
		if (err) {
			res.send('There was an error logging in. Please try again soon.');
		} else {
			res.send('{"token":"' + currentBtToken + '","_id":"' + _id + '"}');
		}
	});
	//res.send('GEt user data done. ');
});
app.use('/categories', express.static(__dirname + '/categories'));
app.use('/', routes);
app.use('/api/users', userRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/facebook', notificationRouter);

//app.use('/api/activities', activityRouter);
//app.use('/api/messages', messageRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
