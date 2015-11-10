var config = requireMain('./config');
var express = require('express');
var _ = require('underscore');
var data = require('../modules/data');
var mailer = require('../modules/mailer');

module.exports = {
  sendGet: function(req, res) {
    res.locals.sendPageActive = 'active';
    res.render('send');


    data.getUsers(config.groupList, function(err, users) {
      if (err) throw err;

      _.each(users, function(user) {
        console.log('Listed ' + user.email + '... ')
        // console.log('Emailing ' + user.email + '... ')
        // mailer.sendMail({
        //   from: 'test@osma.net',
        //   to: user.email,
        //   subject: 'hello',
        //   text: 'hello world!'
        // });
      });


    });


  },
  sendPost: function(req, res) {
    res.render('send');
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
