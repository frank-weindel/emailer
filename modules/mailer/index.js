var nodemailer = require('nodemailer');
var sendmailTransport = require('nodemailer-sendmail-transport');

var transporter = nodemailer.createTransport(sendmailTransport({
  path: '/usr/sbin/sendmail'
}));


module.exports = transporter;
