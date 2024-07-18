var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
require('dotenv').config();

var options = {
  service: 'gmail',
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "nnhtrang3107@gmail.com",
    pass: "czug mjmi qxbi jsvp"
  },
};

var transporter = nodemailer.createTransport(options);

router.post('/sendEmail', function (req, res, next) {
  console.log(req.body);
  const heading = req.body.heading;
  const description = req.body.description;
  const recipients = req.body.branchEmail;

  console.log(recipients);

  const mailOptions = {
    from: '"CareAndShare" <CareAndShare@zohomail.com.au>',
    to: recipients,
    subject: heading,
    text: description,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      res.sendStatus(500);
    } else {
      console.log('Email sent:', info.response);
      res.sendStatus(200);
    }
  });
});

router.post('/updateEmailNotificationOptions', function (req, res, next) {
  console.log(req.body);
  const user_ID = req.body.userID;
  console.log(user_ID);
  const type = req.body.Email_type;
  console.log(type);
  req.pool.getConnection(function(err, connection){
    if (err){
        console.error('Error getting connection:', err);
        return res.sendStatus(500);
    }

  const query = ` UPDATE Email_Notification
                  SET notification_type = ?
                  WHERE user_id = ?`;
    connection.query(query, [type, user_ID], function(err, results){
        connection.release();
        if (err) {
            console.error('Error change the notifications: ', err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    });
  });
});




module.exports = router;