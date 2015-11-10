global.requireMain = require.main.require;

var express = require('express');
var _ = require('underscore');
var path = require('path');
var email = require("./endpoints/email");

var app = express();



/*
  Configuration
 */
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'layout');
app.set('views', path.resolve(__dirname, './views'));
app.use('/static', express.static(path.resolve(__dirname, './static')));
// app.use(cookieParser());

/*
  Rounting
 */
app.get('/send', email.sendGet);
app.post('/send', email.sendPost);
app.get('/list', email.list);

//app.get('/email/send', endpoints.email.send);


app.listen(8085, function() {
  console.log('%s listening at %s', app.name, app.url);
});


// console.log('Connecting to ' + globalConfig.mongoUri + '...');
// QuizData.connect().then(function(quizData) {
//   console.log('Connected');
//   globalConfig._quizData = quizData;
//   server.listen(globalConfig.serverPort, function() {
//     console.log('%s listening at %s', server.name, server.url);
//   });
// })






// var nodemailer = require('nodemailer');





// connection.end();