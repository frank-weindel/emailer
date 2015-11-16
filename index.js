global.requireMain = require;

var express = require('express');
var _ = require('underscore');
var path = require('path');
var bodyParser = require('body-parser');
var auth = require('./middleware/auth');
var email = require("./endpoints/email");

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/*
  Configuration
 */
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'layout');
app.set('views', path.resolve(__dirname, './views'));
app.use(auth);
app.use('/static', express.static(path.resolve(__dirname, './static')));
// app.use(cookieParser());

/*
  Rounting
 */
app.get('/', email.sendGet);
app.post('/send', [urlencodedParser], email.sendPost);
app.get('/list', email.list);
app.get('/list.csv', email.listCsv);

//app.get('/email/send', endpoints.email.send);
var port = 8085;

app.listen(port, function() {
  console.log('%s listening at %s port %s', app.name, app.url, port);
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
