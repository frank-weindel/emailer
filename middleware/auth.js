var basicAuth = require('basic-auth');
var config = require('../config');

/**
 * Called to prompt a user for a username/password via HTTP basic auth or
 * to simply let the user know they are no authorized.
 *
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.sendStatus(401);
}

var auth = function (req, res, next) {
  var authUser;
  /*
    Use basic HTTP authentication

    1. User hasn't entered any credentials yet (according to basicAuth), prompt
       them for a username and password ( via unauthorized() )
    2. If user has entered credentials, lookup the user account and check validate
       the password.
    3. If all is well, make that user the authUser.

    In this case, basicAuth handles all persistence we need across any subsequent request.
   */
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }
  /*
    If there's an authUser, set a local and proceed.
    Otherwise... prompt for username / password via unauthorized()
   */
  if (config.authUsername === user.name && config.authPassword === user.pass) {
    res.locals.AUTH_user = authUser;
    return next();
  } else {
    return unauthorized(res);
  }

};

module.exports = auth;
