var express = require("express");
var router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// ******** Handle the server while logging in using Google **********
const CLIENT_ID = '546001364414-cjtk0kvdnmv2rvg0n4duosekb690adbs.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const defaultAvatar = '/uploads/user.png';

router.post('/login', async function (req, res, next) {
  // This code handles a Google login via an AJAX request to the regular login route
  if ('client_id' in req.body && 'credential' in req.body) {
    const ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload['email']);

    req.pool.getConnection(function(cerr, connection) {
      if (cerr) {
        res.sendStatus(500);
        return;
      }
      let query = "SELECT * FROM User WHERE email_address = ?";
        connection.query(query, [payload['email']], function(qerr, results, fields) {
          // connection.release();
          if (qerr) {
            res.sendStatus(500);
            return;
          }
          if (results.length > 0){
            // There is a user
            req.session.userID = results[0].user_id;
            req.session.userRole = "user";
            res.sendStatus(200);
          } else {
            // No user
            let userId = uuidv4();
            let firstName = payload['family_name'];
            let givenName = payload['given_name'];
            let email = payload['email'];
            let value = [userId, firstName, givenName, null, null, null, email, defaultAvatar, 0];
            let query = "INSERT INTO User (user_id, first_name, last_name, password, phone_number, location, email_address, avatar, isManager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(query, value , function(err, results, fields) {
              connection.release();
              if (qerr) {
                console.error('Error inserting user into database:', error);
                res.sendStatus(500);
                return;
              }
              console.log('User inserted successfully:', results);
              req.session.userID = userId;
              req.session.userRole = "user";
              res.sendStatus(200);
            });
          }
        });
    });
  } else if ('email' in req.body && 'password' in req.body) {
    req.pool.getConnection(function(cerr, connection) {
      if (cerr) {
        res.sendStatus(500);
        return;
      }
      // For normal user and manager.
      let query = "SELECT * FROM User WHERE email_address = ?";
      connection.query(query, [req.body.email], function (qerr, results, fields) {
        if (qerr) {
          res.sendStatus(500);
          return;
        }
        if (results.length > 0) {
          const user = results[0];
          bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
            if (err) {
              res.sendStatus(500);
              return;
            }
            if (isMatch) {
              req.session.userID = user.user_id;
              if (user.isManager === 1) {
                req.session.userRole = "manager";
                let query = "SELECT branch_id FROM Branch_Management WHERE user_id = ?";
                connection.query(query, [user.user_id], function (qerr, result, fields) {
                  if (qerr) {
                    res.sendStatus(500);
                    return;
                  }
                  if (result.length > 0){
                    console.log("Fetch the branch_id of the manager successfully");
                    const branch_id = result[0].branch_id;
                    req.session.branchID = branch_id;
                    console.log(req.session.branchID);
                  }
                  res.sendStatus(200);
                });
              } else {
                req.session.userRole = "user";
                res.sendStatus(200);
              }
            } else {
              res.sendStatus(401);
            }
          });
        }
      });
      // For system admin
      let queryAdmin = "SELECT * FROM System_admin WHERE email_address = ?"
      connection.query(queryAdmin,[req.body.email], function (qerr, results, fields) {
        if (qerr) {
          res.sendStatus(500);
          return;
        }
        if (results.length > 0) {
          const admin = results[0];
          bcrypt.compare(req.body.password, admin.password, function(err, isMatch) {
            if (err) {
              res.sendStatus(500);
              return;
            }
            if (isMatch) {
              req.session.userID = admin.admin_id;
              req.session.userRole = "admin";
              console.log(results);
              res.sendStatus(200);
            } else {
              res.sendStatus(401);
            }
          });
        }
      });
      connection.release();
    });
  } else {
    res.status(401).send("Incorrect email or password.");
  }
});

module.exports = router;
