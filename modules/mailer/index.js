var config = requireMain('./config');
var mandrill = require('mandrill-api/mandrill');
var mandrillClient = new mandrill.Mandrill(config.mandrillApiKey);

module.exports = mandrillClient;
