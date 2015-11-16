var config = requireMain('./config');
var express = require('express');
var async = require('async');
var _ = require('underscore');
var data = require('../modules/data');
var mailer = require('../modules/mailer');

var curProgress = {

};

module.exports = {
  sendGet: function(req, res) {
    res.locals.sendPageActive = 'active';
    res.render('send');
  },
  sendPost: function(req, res) {
    res.locals.list = [];
    data.getUsers(config.groupList, function(err, users) {
      if (err) throw err;

      res.locals.list = users;

      /*
        Reset progress of all emails to false
       */
      _.map(users, function(user) {
        curProgress[user.email] = 'pending';
      });

      async.map(users,
        function(user, cb) {
          var mailObj = {
            from: 'secretary@osma.net',
            to: user.email,
            subject: req.body.subject || 'subject',
            text: req.body.content || 'content'
          };
          console.log(mailObj);
          mailer.sendMail(mailObj, function(error, info) {
            if(error){
              curProgress[user.email] = 'failed';
              cb(error, info);
              return;
            }
            curProgress[user.email] = 'sent';
            console.log('Message sent: ' + info.response);
            cb(null, info);
          });
        },
        function() {
          res.redirect('/list');
        }
      );
    })
  },
  list: function(req, res) {
    res.locals.listPageActive = 'active';
    data.getUsers(config.groupList, function(err, users) {
      if (err) throw err;
      res.locals.count = users.length;
      res.locals.list = _.map(users, function(user) {
        user.result = curProgress[user.email] || 'not sent';
        return user;
      });
      res.render('list');
    });
  },
  listCsv: function(req, res) {
    data.getUsers(config.groupList, function(err, users) {
      if (err) throw err;
      res.writeHead(200, {
        // 'Content-Length': image.length,
        'Content-Type': 'text/csv'
      });
      res.locals.count = users.length;
      res.locals.list = users;
      res.render('listCsv', {
        layout: false
      });
    });
  }
};
