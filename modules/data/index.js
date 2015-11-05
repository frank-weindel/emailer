var db = require('../db');
var _ = require('underscore');

function getUsers(queryGroupIds, cb) {
  var users = {};
  var userIdsByGroupId = {};

  function registerUser(userId, groupId) {
    if (!userIdsByGroupId[groupId]) {
      userIdsByGroupId[groupId] = [];
    }
    userIdsByGroupId[groupId].push(userId);
  }

  db.query('SELECT userid, username, email, usergroupid, membergroupids FROM user ORDER BY username ASC', function(err, rows, fields) {
    if (err) cb(err);

    /*
      Index every user and register them for each group they belong to
     */
    _.each(rows, function(row) {
      var userId = row.userid;
      var memberGroups = row.membergroupids.split(',');
      users[userId] = row;
      registerUser(userId, row.usergroupid);
      _.each(memberGroups, function(groupId) {
        registerUser(userId, groupId);
      });
    });

    /*
      Return a unique list of users based on selected groups
     */
    cb(null,
      _.chain(queryGroupIds)
        .map(function(gid) {
          return userIdsByGroupId[gid] || [];
        })
        .flatten()
        .uniq()
        .map(function(uid) {
          return users[uid];
        })
        .value()
    );


  });
}

module.exports = {
  getUsers: getUsers
};
