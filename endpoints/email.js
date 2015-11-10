var config = requireMain('./config');
var express = require('express');
var _ = require('underscore');
var data = require('../modules/data');
var mailer = require('../modules/mailer');

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

      _.each(users, function(user) {
        var mailObj = {
          from: 'secretary@osma.net',
          to: user.email,
          subject: req.body.subject || 'subject',
          text: req.body.content || 'content'
        };
        console.log(mailObj);
        mailer.sendMail(mailObj, function(error, info) {
          if(error){
              return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });
      });
      res.render('sendPost');
    })
  },
  list: function(req, res) {
    res.locals.listPageActive = 'active';
    data.getUsers(config.groupList, function(err, users) {
      if (err) throw err;

      res.locals.list = users;
      console.log(users);
      res.render('list');

    });
  }
};
