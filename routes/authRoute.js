var express = require('express');
var router = express.Router();
const mysql = require('mysql');

router.get('/getSession', function(req, res, next) {
  try {
    if (req.session.userID) {
      const query = 'SELECT avatar FROM User WHERE user_id = ?';
      const connection = mysql.createConnection({
        host: 'localhost',
        database: 'CareAndShare'
      });

      connection.query(query, req.session.userID,function (error, results, fields){
        if (error) {
          console.error('Error editing user info into database:', error);
          res.sendStatus(500);
          return;
        }
        if (req.session.userRole === "user"){
          const avatar = results[0].avatar;
          connection.end();
          res.send({
            avatar: avatar,
            userID: req.session.userID,
            userRole: req.session.userRole,
          });
          console.log("The session for normal user is fetched");
        } else if (req.session.userRole === "manager"){
          const avatar = results[0].avatar;
          connection.end();
          res.send({
            avatar: avatar,
            userID: req.session.userID,
            userRole: req.session.userRole,
            branchID: req.session.branchID
          });
          console.log("The session for manager is fetched");
        } else if (req.session.userRole === "admin"){
          const query2 = 'SELECT avatar FROM System_admin WHERE admin_id = ?';
          connection.query(query2,req.session.userID, function(error, resultsAdmin, fields){
            connection.end(); 
            if (error) {
              console.error('Error editing user info into database:', error);
              res.sendStatus(500);
              return;
            }
            const avatar = resultsAdmin[0].avatar;
            res.send({
              avatar: avatar,
              userID: req.session.userID,
              userRole: req.session.userRole,
            });
            console.log("The session for admin is fetched");
          });
        }
      });
    } else {
      console.log("No session found, responding as guest");
      res.send({
        userRole: "guest"
      });
    }
 } catch (error) {
    console.error('Error in getSession:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).send('Failed to log out');
      }
      res.sendStatus(200);
  });
});

module.exports = router;


