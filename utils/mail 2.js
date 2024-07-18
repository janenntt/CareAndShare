var nodemailer = require("nodemailer");

var options = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "CareAndShare@Adelaide.edu.au",
      pass: "CareAndShare",
    },
  };

var transporter = nodemailer.createTransport(options);
exports.options = options;
exports.transporter = transporter;