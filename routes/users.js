var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { userInfo } = require('os');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads');
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the upload directory exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  }
});

// Create the multer instance with the storage settings
const upload = multer({ storage: storage });

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

const defaultAvatar = '/uploads/user.png';
router.post('/EditUsersInfo', upload.single('avatar-url'),function (req, res, next){
  const yourUserID = req.session.userID;
  if(!yourUserID){
    res.sendStatus(403).json('You have not logged in');
  }
  if(req.session.userRole !== "admin"){
    const {email, firstName, givenName, location, phone } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : defaultAvatar;
    const connection = mysql.createConnection({
      host: 'localhost',
      database: 'CareAndShare'
    });
    const query = `UPDATE User SET first_name = ?, last_name = ?, phone_number = ?, location = ?, email_address = ?, avatar = ? WHERE user_id = ?`;
    const values = [firstName, givenName, phone, location, email, avatar, yourUserID];
    connection.query(query, values, function (error, results, fields) {
      connection.end();
      if (error) {
        console.error('Error editing user info into database:', error);
        res.sendStatus(500);
        return;
      }
      console.log('User edited successfully:', results);
      res.redirect('../MyAccount.html');
    });
  }else{
    const {email, firstName, givenName, location, phone } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : defaultAvatar;
    const connection = mysql.createConnection({
      host: 'localhost',
      database: 'CareAndShare'
    });
    const query = `UPDATE System_admin SET first_name = ?, last_name = ?, phone_number = ?, location = ?, email_address = ?, avatar = ? WHERE admin_id = ?`;
    const values = [firstName, givenName, phone, location, email, avatar, yourUserID];
    connection.query(query, values, function (error, results, fields) {
      connection.end();
      if (error) {
        console.error('Error editing user info into database:', error);
        res.sendStatus(500);
        return;
      }
      console.log('User edited successfully:', results);
      res.redirect('../MyAccount.html');
    });
  }

});

router.get('/getData', function (req, res, next) {
  const yourUserID = req.session.userID;
  const yourRole = req.session.userRole;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  if(!yourUserID){
    res.sendStatus(403).json('You have not logged in');
  }
  if(yourRole !== "admin"){
    const query = "SELECT * FROM User WHERE user_id = ?";
    connection.query(query, yourUserID, function (err, results, fields) {
      if (err) {
        console.error('Error checking database:', err);
        connection.end();
        res.sendStatus(500);
        return;
      }
      if(results.length > 0){
        const result = results[0];
        const query = 'SELECT Branch.branch_name, Branch.branch_id FROM Membership JOIN Branch ON Membership.branch_id = Branch.branch_id WHERE Membership.user_id = ?';
        connection.query(query, yourUserID, function (err, results, fields) {
          connection.end();
          if (err) {
            console.error('Error checking database:', err);
            connection.end();
            res.sendStatus(500);
            return;
          }
          const branches = results.map(branch => ({
            name: branch.branch_name,
            id: branch.branch_id
          }));
          const response = {
            role: yourRole,
            user: result,
            branches: branches
          };
          res.json(response);
        });
      }
    });
  }else{
    const query = "SELECT * FROM System_admin WHERE admin_id = ?";
    connection.query(query, yourUserID, function (err, results, fields) {
      connection.end();
      if (err) {
        console.error('Error checking database:', err);
        connection.end();
        res.sendStatus(500);
        return;
      }
      const result = results[0];
      const branches = [];
      const response = {
        role: yourRole,
        user: result,
        branches: branches
      };
      res.json(response);
    });
  }

});

router.get("/view-branches", function(req,res,next){
  req.pool.getConnection(function(err, connection){
    if (err){
      connection.release();
      return res.sendStatus(500);
    }
    var query = "SELECT * FROM Branch";
    connection.query(query,function(err,rows,fields){
      connection.release();
      if (err){
        return res.sendStatus(500);
      }
      return res.send(rows);
    });
  });
});

router.post('/LeaveBranch', function(req,res,next){
  const branchId = req.body.branchId;
  const user = req.session.userID;
  if(!user){
    res.sendStatus(403).json("You have not logged in");
  }
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = 'DELETE FROM Membership WHERE user_id = ? AND branch_id = ?';
  connection.query(query, [user,branchId], function(err,results,fields){
    connection.end();
    if (err) {
      console.error('Error checking database:', err);
      connection.end();
      res.sendStatus(500);
      return;
    }
    return res.status(200).send('Leave branch successfully');
  });
});

router.post('/changePassword', function(req, res, next) {
  const userId = req.session.userID;
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const role = req.session.userRole;
  if (!userId) {
    return res.status(403).json('You are not logged in');
  }

  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });

  connection.connect();
  if(role !== "admin"){
    const query = "SELECT * FROM User WHERE user_id = ?";
    connection.query(query, [userId], function(qerr, results) {
      if (qerr) {
        console.error('Error fetching user by id:', qerr);
        connection.end();
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        const user = results[0];

        // Compare old password
        bcrypt.compare(oldPassword, user.password, function(err, isMatch) {
          if (err) {
            console.error('Error comparing old passwords:', err);
            connection.end();
            return res.sendStatus(500);
          }

          if (isMatch) {
            // Hash the new password
            bcrypt.hash(newPassword, 10, function(err, hashedPassword) {
              if (err) {
                console.error('Error hashing new password:', err);
                connection.end();
                return res.sendStatus(500);
              }

              // Update the password in the database
              const userQuery = 'UPDATE User SET password = ? WHERE user_id = ?';
              const values = [hashedPassword, userId];
              connection.query(userQuery, values, function(error) {
                if (error) {
                  console.error('Error updating password:', error);
                  connection.end();
                  return res.sendStatus(500);
                }

                console.log('Password updated successfully');
                connection.end();
                res.status(200).json('Password update successful');
              });
            });
          } else {
            res.status(401).json('Old password does not match');
            connection.end();
          }
        });
      } else {
        res.status(404).json('User not found');
        connection.end();
      }
    });
  }else{
    const query = "SELECT * FROM System_admin WHERE admin_id = ?";
    connection.query(query, [userId], function(qerr, results) {
      if (qerr) {
        console.error('Error fetching user by id:', qerr);
        connection.end();
        return res.sendStatus(500);
      }

      if (results.length > 0) {
        const user = results[0];
        bcrypt.compare(oldPassword, user.password, function(err, isMatch) {
          if (err) {
            console.error('Error comparing old passwords:', err);
            connection.end();
            return res.sendStatus(500);
          }
          if (isMatch) {
            // Hash the new password
            bcrypt.hash(newPassword, 10, function(err, hashedPassword) {
              if (err) {
                console.error('Error hashing new password:', err);
                connection.end();
                return res.sendStatus(500);
              }

              // Update the password in the database
              const userQuery = 'UPDATE System_admin SET password = ? WHERE admin_id = ?';
              const values = [hashedPassword, userId];
              connection.query(userQuery, values, function(error) {
                if (error) {
                  console.error('Error updating password:', error);
                  connection.end();
                  return res.sendStatus(500);
                }

                console.log('Password updated successfully');
                connection.end();
                res.status(200).json('Password update successful');
              });
            });
          } else {
            res.status(401).json('Old password does not match');
            connection.end();
          }
        });
      } else {
        res.status(404).json('User not found');
        connection.end();
      }
    });
  }

});
module.exports = router;
