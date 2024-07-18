var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');
router.get('/getAllUsersData', function(req,res, next){
    const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
    const connection = mysql.createConnection({
      host: 'localhost',
      database: 'CareAndShare'
    });

    const query = `SELECT user_id, first_name, last_name, location, isManager FROM User`;
    connection.query(query, function (err, results, fields) {
      if (err) {
        console.error('Error checking database:', err);
        connection.end();
        res.sendStatus(500);
        return;
      }
      if(results.length > 0){
        res.status(200).json(results);
      }else{
        connection.end();
        return res.status(200).send('There is no user yet');
      }
    });
});

router.get('/getUserInfo', function(req, res, next){
  const userId = req.query.userId;
  const userRole = req.session.userRole;
  if(userRole !== "admin"){
    res.sendStatus(403).json({ error: 'You are not an admin' });
  }
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  const query = 'SELECT * FROM User WHERE user_id = ?';
  connection.query(query, userId,function(error, resultsUser, fields){
    if (error){
      connection.end();
      console.error('Error fetching user details: ', error);
      return res.sendStatus(500);
    }
    if(resultsUser.length > 0){
      const userInfo = resultsUser[0];
      const branchQuery = 'SELECT Branch.branch_name, Branch.branch_id FROM Membership JOIN Branch ON Membership.branch_id = Branch.branch_id WHERE Membership.user_id = ?';
      connection.query(branchQuery, userId, function(error, resultsBranch, fields){
        connection.end();
        if (error) {
          console.error('Error getting branches', error);
          res.sendStatus(500);
          return;
        }
        //const branches = resultsBranch.map(branch => branch.branch_name);
        const branches = resultsBranch.map(branch => ({
          name: `${branch.branch_name}`,
          id: branch.branch_id
        }));
        const response = {
          user: userInfo,
          branches: branches
        };
        res.json(response);
      });
    }
  });
});


router.post('/adminEditUser', function(req,res, next){
  const userRole = req.session.userRole;
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const firstName = req.body.firstName;
  const givenName = req.body.givenName;
  const location = req.body.location;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.emailAddress;
  const id = req.body.userId;
  console.log(id);
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = `UPDATE User SET first_name = ?, last_name = ?, phone_number = ?, location = ?, email_address = ? WHERE user_id = ?`;
  const values = [firstName, givenName, phoneNumber, location, email, id];
  connection.query(query, values, function (error, results, fields) {
    connection.end();
    if (error) {
      console.error('Error editing user info into database:', error);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
    console.log('User edited successfully:', results);
  });
});

router.post('/adminRemoveBranch', function(req, res, next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const userId = req.body.user;
  const branch = req.body.branch;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = 'DELETE Membership FROM Membership JOIN Branch ON Membership.branch_id = Branch.branch_id WHERE Membership.user_id = ? AND Branch.branch_name = ?';
  const values = [userId, branch];
  connection.query(query, values, function (error, results, fields) {
    connection.end();
    if (error) {
      console.error('Error editing deleting user from branch', error);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
    console.log('User removed from branch successfully:', results);
  });
});

router.post('/adminDeleteUser', function(req, res, next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const userId = req.body.userId;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = 'DELETE FROM User WHERE user_id = ?';
  connection.query(query, userId, function(error, results, fields){
    connection.end();
    if (error) {
      console.error('Error deleting user from database', error);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
    console.log('User removed database successfully:', results);
  });
});

router.get('/getAllbranches', function(req,res,next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = "SELECT * FROM Branch";
  connection.query(query, function(err,results,fields){
    if (err) {
      console.error('Error checking database:',err);
      connection.end();
      res.sendStatus(500);
      return;
    }
    if (results.length > 0){
      res.status(200).send(results);
    } else {
      connection.end();
      return res.status(200).send('There are no branches.');
    }
  });
});

router.post('/adminDeleteBranch', function(req,res,next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const branchId = req.body.branchId;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });

  const query = "DELETE FROM Branch WHERE branch_id = ?";
  connection.query(query, [branchId], function(err, results, fields){
    console.log("This is called");
    if (err) {
      console.error('Error deleting branch:',err);
      connection.end();
      res.sendStatus(500);
      return;
    }
    if (results){
      // res.send(results);
      res.sendStatus(200);
    } else {
      connection.end();
      res.sendStatus(401);
    }
  });
});

router.get('/getBranchInfo', function(req, res, next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const branchId = req.query.branchId;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  if (!branchId) {
    return res.status(400).json({ error: 'Branch ID is required' });
  }
  const query = 'SELECT * FROM Branch WHERE branch_id = ?';
  connection.query(query, branchId,function(error, resultsBranch, fields){

    if (error){
      connection.end();
      console.error('Error fetching user details: ', error);
      return res.sendStatus(500);
    }
    if(resultsBranch.length > 0){
      const branchInfo = resultsBranch[0];
      const userQuery = 'SELECT User.first_name, User.last_name, User.user_id FROM Membership JOIN Branch ON Membership.branch_id = Branch.branch_id JOIN User ON Membership.user_id = User.user_id WHERE Branch.branch_id = ?';
      connection.query(userQuery, branchId, function(error, resultsMembers, fields){
        if (error) {
          console.error('Error getting members', error);
          res.sendStatus(500);
          return;
        }
        const members = resultsMembers.map(member => ({
          name: `${member.first_name} ${member.last_name}`,
          id: member.user_id // Assuming there's a user_id field for uniqueness
        }));
        const response = {
          branch: branchInfo,
          members: members,
        };
        res.json(response);
      });
    }
  });
});

router.post('/adminEditBranch', function(req,res, next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const name = req.body.name;
  const email = req.body.email;
  const location = req.body.location;
  const phone = req.body.phone;
  const description = req.body.description;
  const id = req.body.branchId;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = `UPDATE Branch SET branch_name = ?, branch_description = ?, branch_phone_number = ?, branch_location = ?, branch_email = ? WHERE branch_id = ?`;
  const values = [name, description, phone, location, email, id];
  connection.query(query, values, function (error, results, fields) {
    connection.end();
    if (error) {
      console.error('Error editing Branch info into database:', error);
      res.sendStatus(500);
      return;
    }

    res.sendStatus(200);
    console.log('Branch edited successfully:', results);
  });
});

router.get('/getUsersNotInBranch',function(req,res, next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const id = req.query.branchId;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = 'SELECT u.user_id, u.first_name, u.last_name FROM User u LEFT JOIN Membership m ON u.user_id = m.user_id AND m.branch_id = ? WHERE m.branch_id IS NULL AND u.isManager = 0';
  connection.query(query, id,function (error, results, fields){
    connection.end();
    if (error) {
      console.error('Error retrieving members:', error);
      res.sendStatus(500);
      return;
    }
    const users = results.map(user => ({
      name: `${user.first_name} ${user.last_name}`,
      id: user.user_id // Assuming there's a user_id field for uniqueness
    }));
    const response = {
      branchId: id,
      users: users
    };
    res.send(response);
  });
});

router.post('/adminAddUserToBranch', function(req,res, next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const branch = req.body.branch;
  const user = req.body.user;
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = 'INSERT INTO Membership (user_id, branch_id) VALUES (?,?)';
  values = [user, branch];
  connection.query(query, values,function (error, results, fields){
    connection.end();
    if (error) {
      console.error('Error adding members to branch:', error);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
    console.log(results);
  });
});

router.get('/getUsersAssignManagers', function(req,res, next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  const query = 'SELECT u.user_id, u.first_name, u.last_name FROM User u LEFT JOIN Membership m ON u.user_id = m.user_id WHERE u.isManager = 0 AND m.user_id IS NULL';
  connection.query(query, function (error, results, fields){
    connection.end();
    if (error) {
      console.error('Error finding members who has not joined any branch:', error);
      res.sendStatus(500);
      return;
    }
    const users = results.map(user => ({
      name: `${user.first_name} ${user.last_name}`,
      id: user.user_id
    }));
    const response = {
      users: users
    };
    console.log(response);
    res.send(response);
  });
});

router.post('/adminCreateNewBranch',function(req,res, next){
  const userRole = req.session.userRole;
    console.log(userRole);
    if(userRole !== "admin"){
      res.sendStatus(403).json({ error: 'You are not an admin' });
    }
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const location = req.body.location;
  const description = req.body.description;
  const manager = req.body.managerId;
  const image_url = null;
  const id = uuidv4();
  const connection = mysql.createConnection({
    host: 'localhost',
    database: 'CareAndShare'
  });
  console.log();
  const query = "INSERT INTO Branch VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [id, name, description, phone, location, email, image_url];
  connection.query(query, values, function (error, results, fields){
    if (error) {
      console.error('Error inserting branch', error);
      res.sendStatus(500);
      return;
    }
    console.log("insert branch successfully", results);
    const queryManager = 'UPDATE User SET isManager = 1 WHERE user_id = ?';
    connection.query(queryManager, manager, function (error, results2, fields){
      if (error) {
        console.error('Error assigning manager', error);
        res.sendStatus(500);
        return;
      }
      console.log("update manager successfully", results2);
      const branchManagement = 'INSERT INTO Branch_Management (branch_id, user_id) VALUES (?,?)';
      const branchManaValues = [id, manager];
      connection.query(branchManagement, branchManaValues, function(manaError, manaResults){
        connection.end();
        if (manaError) {
          console.error('Error inserting management into database:', manaError);
          return res.sendStatus(500);
        }
        console.log('Management inserted successfully:', manaResults);
        return res.sendStatus(200);
      });
    });
  });
});
module.exports = router;


