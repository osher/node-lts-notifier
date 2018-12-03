module.exports = (conf, {
  nodemailer = require('nodemailer')
} = {}) =>
  //Temporary: hardcode support just for smtp
  nodemailer.createTransport(conf.options);
