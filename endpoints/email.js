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
      curProgress = {};
      _.map(users, function(user) {
        curProgress[user.email] = {
          id: null,
          status: 'pending'
        };
      });

      var message = {
        text: req.body.content,
        subject: req.body.subject,
        from_email: 'secretary@osma.net',
        from_name: 'OSMA Secretary',
        to: _.map(users, function(user) {
          return {
            email: user.email,
            type: 'to'
          };
        }),
        track_opens: true
      };
      var sendDate = new Date();
      mailer.messages.send({
        message: message,
        async: true
      }, function(result) {
        _.each(result, function(r) {
          curProgress[r.email] = {
            id: r._id,
            status: r.status,
            date: sendDate.toLocaleDateString() + ' ' + sendDate.toLocaleTimeString()
          };
          console.log('Message sent: ', r);
        });
        res.redirect('/list');
      }, function(e) {
        _.each(users, function(user) {
          curProgress[user.email] = {
            id: null,
            status: 'error',
            date: sendDate.toLocaleDateString() + ' ' + sendDate.toLocaleTimeString()
          };
        });
        console.log('Mandrill error: ', e);
        res.redirect('/list');
      });

      // async.map(users,
      //   function(user, cb) {
      //     var message = {
      //       text: req.body.content,
      //       subject: req.body.subject,
      //       from_email: 'secretary@osma.net',
      //       from_name: 'OSMA Secretary',
      //       to: [{
      //         email: user.email,
      //         type: 'to'
      //       }],
      //       track_opens: true
      //     };

      //     mailer.messages.send({
      //       message: message,
      //       async: true
      //     }, function(result) {
      //       curProgress[user.email] = result[0].status;
      //       console.log('Message sent: ', result[0]);
      //       cb(null, result);
      //     }, function(e) {
      //       curProgress[user.email] = 'failed';
      //       console.log('Send fail: ', e);
      //       cb(e);
      //     });
      //   },
      //   function() {
      //     res.redirect('/list');
      //   }
      // );
    });
  },
  list: function(req, res) {
    res.locals.listPageActive = 'active';
    data.getUsers(config.groupList, function(err, users) {
      if (err) throw err;
      res.locals.count = users.length;

      // res.locals.list = _.map(users, function(user) {
      //   user.result = curProgress[user.email] || 'not sent';
      //   return user;
      // });

      // res.render('list');


      async.map(users,
        function(user, cb) {
          if (!curProgress[user.email]) {
            cb(null, {
              username: user.username,
              email: user.email,
              result: 'not sent',
              date: 'never'
            });
            return;
          }
          mailer.messages.info(
            {id: curProgress[user.email].id},
            function(result) {
              cb(null, {
                username: user.username,
                email: user.email,
                result: result.state,
                date: curProgress[user.email].date || 'never'
              });
            },
            function(e) {
              cb(null, {
                username: user.username,
                email: user.email,
                result: curProgress[user.email].status || 'unknown',
                date: curProgress[user.email].date || 'never'
              });
            }
          );
        },
        function(err2, list) {
          if (err2) {
            throw err2;
          }
          res.locals.list = list;
          res.render('list');
        }
      );
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
