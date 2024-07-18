var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql');


const defaultAvatar = '/uploads/user.png';
router.post('/SignUp', function (req, res, next){
    const userId = uuidv4();
    const firstName = req.body.firstName;
    const givenName = req.body.givenName;
    const location = req.body.location;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    const email = req.body.emailAddress;
    const avatar = defaultAvatar;
    const isManager = req.body.isManager;
    const connection = mysql.createConnection({
      host: 'localhost',
      database: 'CareAndShare'
    });
    connection.connect(function(err) {
      if (err) {
        console.error('Error connecting to database:', err.stack);
        res.sendStatus(500);
        return;
      }
      console.log('Connected to database', connection.threadId);
    });
    bcrypt.hash(password, 10, function (err, hashedPassword) {
      if (err) {
        res.sendStatus(500);
        connection.end(); // Close database connection
        return;
      }
      const checkDatabaseQuery = "SELECT * FROM User WHERE email_address = ?";
      connection.query(checkDatabaseQuery, email, function (err, results, fields) {
        if (err) {
          console.error('Error checking database:', err);
          connection.end();
          res.sendStatus(500);
          return;
        }
        if(results.length > 0){
          console.log('Email already exists');
          connection.end();
          return res.status(409).send('Email already exists');
        }
        const query = "INSERT INTO User (user_id, first_name, last_name, password, phone_number, location, email_address, avatar, isManager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [userId, firstName, givenName, hashedPassword, phoneNumber, location, email, avatar, isManager];
        connection.query(query, values, function (error, results, fields) {
          connection.end();
          if (error) {
            console.error('Error inserting user into database:', error);
            res.sendStatus(500);
            return;
          }
          console.log('User inserted successfully:', results);
          res.sendStatus(200);
      });
    });
  });
});

router.post('/SignUpManager1', function (req, res, next) {
  const email = req.body.emailAddress;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const checkDatabaseQuery = "SELECT * FROM User WHERE email_address = ?";
  connection.query(checkDatabaseQuery, email, function (err, results, fields) {
    if (err) {
      console.error('Error checking database:', err);
      connection.end();
      res.sendStatus(500);
      return;
    }
    if(results.length > 0){
      console.log('Email already exists');
      connection.end();
      return res.status(409).send('Email already exists');
    }else{
      connection.end();
      return res.status(200).send('Email is valid');
    }
  });
});

router.post('/SignUpManager', function (req, res, next) {
const userId = uuidv4();
const firstName = req.body.firstName;
const givenName = req.body.givenName;
const location = req.body.location;
const phoneNumber = req.body.phoneNumber;
const password = req.body.password;
const email = req.body.emailAddress;
const avatar = defaultAvatar;
const isManager = req.body.isManager;

const BranchId = uuidv4();
const branchname = req.body.branchName;
const branchName = branchname.toLowerCase();
const branchDescription = req.body.branchDescription;
const branchPhoneNumber = req.body.phoneNumberBranch;
const branchEmail = req.body.branchEmailAddress;
const branchAvatar = '/images/logo.png';
const branchLocation = req.body.locationBranch;

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
});

connection.connect(function(err) {
    if (err) {
    console.error('Error connecting to database:', err.stack);
    return res.sendStatus(500);
    }
    console.log('Connected to database', connection.threadId);
});

const checkDatabaseQuery = "SELECT * FROM Branch WHERE branch_name = ?";
connection.query(checkDatabaseQuery, branchName, function (err, results, fields) {
    if (err) {
    console.error('Error checking database:', err);
    connection.end();
    res.sendStatus(500);
    return;
    }
    if(results.length > 0){
    console.log('Branch already exists');
    connection.end();
    return res.status(409).send('Branch already exists'); // 409 Conflict
    }

    // Hash the password
    bcrypt.hash(password, 10, function (err, hashedPassword) {
        if (err) {
        connection.end();
        return res.sendStatus(500);
        }
        // Insert new user
        const userQuery = 'INSERT INTO User (user_id, first_name, last_name, password, phone_number, location, email_address, avatar, isManager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const userValues = [userId, firstName, givenName, hashedPassword, phoneNumber, location, email, avatar, isManager];
        connection.query(userQuery, userValues, function (error, results) {
          if (error) {
            console.error('Error inserting manager into database:', error);
            connection.end();
            return res.sendStatus(500);
          }
          console.log('Manager inserted successfully:', results);

          // Insert new branch
          const branchQuery = 'INSERT INTO Branch (branch_id, branch_name, branch_description, branch_phone_number, branch_location, branch_email, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
          const branchValues = [BranchId, branchName, branchDescription, branchPhoneNumber, branchLocation, branchEmail, branchAvatar];
          connection.query(branchQuery, branchValues, function (branchError, branchResults) {
            if (branchError) {
              console.error('Error inserting branch into database:', branchError);
              return res.sendStatus(500);
            }
            console.log('Branch inserted successfully:', branchResults);
            const branchManagement = 'INSERT INTO Branch_Management (branch_id, user_id) VALUES (?,?)';
            const branchManaValues = [BranchId, userId];
            connection.query(branchManagement, branchManaValues, function(manaError, manaResults){
              connection.end();
              if (manaError) {
                console.error('Error inserting branch into database:', manaError);
                return res.sendStatus(500);
              }
              console.log('Management inserted successfully:', manaResults);
              return res.sendStatus(200);
            });
          });
        });
    });
  });
});

// add SIGN UP EVENT
router.post('/SignUpEvent', function (req, res, next){
  const EventId = uuidv4();
  const eventname = req.body.eventName;
  const eventName = eventname.toLowerCase();
  const eventLocation = req.body.event_location;
  const eventDate = req.body.event_date;
  const eventTime = req.body.event_time;
  const eventDescription = req.body.event_description;
  const isPrivate = req.body.is_private;

  const connection = mysql.createConnection({
      host: 'localhost',
      database: 'CareAndShare'
  });

  connection.connect(function(err) {
      if (err) {
        console.error('Error connecting to database:', err.stack);
        return res.sendStatus(500);
      }
      console.log('Connected to database', connection.threadId);
  });

  const checkDatabaseQuery = "SELECT * FROM Event WHERE event_name = ?";
  connection.query(checkDatabaseQuery, eventName, function (err, results, fields) {
    if (err) {
      console.error('Error checking database:', err);
      connection.end();
      res.sendStatus(500);
      return;
    }
    if(results.length > 0){
      console.log('Event already exists');
      connection.end();
      return res.status(409).send('Event already exists'); // 409 Conflict
    }

    // Insert new event
    const eventQuery = 'INSERT INTO Event (event_id, event_description, event_date, event_time, event_location, is_private) VALUES (?, ?, ?, ?, ?, ?)';
    const eventValues = [EventId, eventName, eventDescription, eventLocation, eventDate, eventTime, isPrivate];
    connection.query(eventQuery, eventValues, function (eventError, eventResults) {
      if (eventError) {
        console.error('Error inserting event into database:', eventError);
        return res.sendStatus(500);
      }
      console.log('Event inserted successfully:', eventResults);
      connection.end();
      return res.sendStatus(200);
    });
  });
});

router.post('/SignUpAdmin', function (req, res, next){
  const adminId = uuidv4();
  const firstName = req.body.firstName;
  const givenName = req.body.givenName;
  const location = req.body.location;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const email = req.body.emailAddress;
  const avatar = defaultAvatar;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  connection.connect(function(err) {
    if (err) {
    console.error('Error connecting to database:', err.stack);
    res.sendStatus(500);
    return;
    }
    console.log('Connected to database', connection.threadId);
  });
  bcrypt.hash(password, 10, function (err, hashedPassword) {
    if (err) {
    res.sendStatus(500);
    connection.end(); // Close database connection
    return;
    }
    const checkEmailQuery = "SELECT * FROM System_admin WHERE email_address = ?";
    connection.query(checkEmailQuery, email, function (err, results, fields) {
    if (err) {
        console.error('Error checking database:', err);
        connection.end();
        res.sendStatus(500);
        return;
    }
    if(results.length > 0){
        console.log('Email already exists');
        connection.end();
        return res.status(409).send('Email already exists'); // 409 Conflict
    }
    const query = "INSERT INTO System_admin (admin_id, first_name, last_name, password, phone_number, location, avatar, email_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [adminId, firstName, givenName, hashedPassword, phoneNumber, location, avatar, email];
    connection.query(query, values, function (error, result, fields) {
        connection.end(); // Close database connection
        if (error) {
        console.error('Error inserting user into database:', error);
        res.sendStatus(500);
        return;
        }
        console.log('Admin inserted successfully:', result);
        res.sendStatus(200);
    });
   });
  });
});

module.exports = router;