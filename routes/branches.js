const express = require('express');
const mysql = require('mysql');
const db = require("../utils/db");
const multer = require('multer');
const fs = require("fs");
var router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/uploads');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Create new branch
router.post('/create_branch', function(req, res, next){

    req.pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      return res.status(500).send("An interval server error occurred.");
    }

    var {
        branch_name,
        branch_email,
        branch_phone_number,
        branch_location,
        branch_description,
    } = req.body;

    // Get all data from req.body and check for completeness
    if (!branch_name||!branch_email||!branch_phone_number||!branch_location||!branch_description){
        connection.release();
        return res.status(400).send("Missing information");
    }

    var query =
        "INSERT INTO Branch (branch_name, branch_description, branch_phone_number, branch_location, branch_email) VALUES (?,?,?,?,?)";
        connection.query(
            query,
            [
                branch_name,
                branch_description,
                branch_phone_number,
                branch_location,
                branch_email,

            ],
            function (err, rows, fields) {
                if (err){
                    connection.release();
                    return res.status(500).send("Internal Server Error Occurred.");
                }

                connection.release();
                return res.send("New branch registered!");

            }
        );
    });
});

// Get data from all branches
router.get('/get_branches', function(req,res,next){
    req.pool.getConnection(function(err, connection){
        if (err){
            connection.release();
            return res.sendStatus(500);
        }
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
});

// Get data of a specific branch
router.get('/get_branch_data', function(req,res,next){
    req.pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            return res.sendStatus(500);
        }

        const user_id = req.session.userID;
        if (!user_id){
            connection.release();
            return res.status(400).send('User ID is required.');
        }
        console.log('Current user ID:', user_id);

        const management_query = "SELECT branch_id FROM Branch_Management WHERE user_id = ?";
        connection.query(management_query, [user_id], function(err,results){
            if (err) {
                console.error('Error querying Branch_Management table: ',err);
                connection.release();
                return res.sendStatus(500);
            }

            if (results.length === 0){
                connection.release();
                return res.status(403).send('User is not a manager');
            }

            const branch_id = results[0].branch_id;
            console.log('Branch ID for user:', branch_id);

            const branch_query = "SELECT * FROM Branch WHERE branch_id = ?";
            connection.query(branch_query, [branch_id], function(err,results){
                if (err) {
                    console.error('Error querying Branch table:', err);
                    connection.release();
                    return res.sendStatus(500);
                }

                if (results.length === 0 ){
                    connection.release();
                    return res.status(404).send('Branch not found.');
                }

                console.log('Branch data found:', results[0]);
                res.status(200).json(results[0]);
                connection.release();
            });
        });
    });
});

// Branch Details pages
router.get("/branch_details/:branch_id", function(req,res,next){
    const branch_id = req.params.branch_id;
    if (!branch_id){
        res.sendStatus(400);
    }

    req.pool.getConnection(function(err,connection){
        if(err) {
            connection.release();
            return res.sendStatus(500);
        }

        let query = "SELECT * FROM Branch WHERE branch_id = ?";
        connection.query(query, branch_id ,function(err,results,fields){
            if(err){
                console.error('Error fetching branch details: ',err);
                return res.sendStatus(500);
            }
            if (results.length > 0){
                const branch = results[0];
                const escapeHtml = (unsafe) => {
                    return String(unsafe).replace(/[&<>"']/g, function(m){
                        switch (m) {
                            case '&': return '&amp;';
                            case '<': return '&lt;';
                            case '>': return '&gt;';
                            case '"': return '&quot;';
                            case "'": return '&#039;';
                            default: return m;
                        }
                    });
                };

                const branchHTML = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${escapeHtml(branch.branch_name)}</title>
                        <link rel="stylesheet" href="../stylesheets/headerAndFooter.css">
                        <link rel="stylesheet" href="../stylesheets/branch_details.css">
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
                        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
                        <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
                        <script src="https://kit.fontawesome.com/8fa1834599.js" crossorigin="anonymous"></script>
                        <link rel="stylesheet" href="https://aui-cdn.atlassian.com/aui-adg/6.0.13/css/aui.min.css" />
                        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
                        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
                    </head>
                    <body>
                        <header>
                            <nav>
                                <a href = "/">
                                    <img src="/images/logo.png" alt = "care-and-share-logo" id="logo">
                                </a>
                                <a href = "../AboutUs.html" id="About">About</a>
                                <a href = "../EventList.html" id="Events">Events</a>
                                <a href = "../BranchGrid.html" id="Branches">Branches</a>
                            </nav>

                            <div style="display: flex;" class="right_header1">
                                <a href="../signup_login/login.html" id="Login">Login</a>
                                <form>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="rgba(173,184,194,1)"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path></svg>
                                    <input  type="text" placeholder="Search...">
                                </form>
                            </div>

                            <div style="display: none;" class="right_header2" id="manager">
                                <div id="icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 15.6315L20.9679 10.8838L20.0321 9.11619L12 13.3685L3.96788 9.11619L3.0321 10.8838L12 15.6315Z"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V18H18V10ZM20 18.6667L20.4 19.2C20.5657 19.4209 20.5209 19.7343 20.3 19.9C20.2135 19.9649 20.1082 20 20 20H4C3.72386 20 3.5 19.7761 3.5 19.5C3.5 19.3918 3.53509 19.2865 3.6 19.2L4 18.6667V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V18.6667ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path></svg>
                                </div>

                                <div style="display: flex;" class="dropdown-menu">
                                    <a href="#">My account</a>
                                    <a href="#">My branch</a>
                                    <a href="#">My Dashboard</a>
                                    <a href="#">Log Out</a>
                                </div>
                            </div>

                            <div  style="display: none;" class="right_header2" id="admin">
                                <div id="icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 15.6315L20.9679 10.8838L20.0321 9.11619L12 13.3685L3.96788 9.11619L3.0321 10.8838L12 15.6315Z"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V18H18V10ZM20 18.6667L20.4 19.2C20.5657 19.4209 20.5209 19.7343 20.3 19.9C20.2135 19.9649 20.1082 20 20 20H4C3.72386 20 3.5 19.7761 3.5 19.5C3.5 19.3918 3.53509 19.2865 3.6 19.2L4 18.6667V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V18.6667ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path></svg>
                                </div>

                                <div style="display: flex;" class="dropdown-menu">
                                    <a href="#">My account</a>
                                    <a href="#">My Dashboard</a>
                                    <a href="#">Log Out</a>
                                </div>
                            </div>

                            <div  style="display: none;" class="right_header2" id="user">
                                <div id="icons">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 15.6315L20.9679 10.8838L20.0321 9.11619L12 13.3685L3.96788 9.11619L3.0321 10.8838L12 15.6315Z"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM6.02332 15.4163C7.49083 17.6069 9.69511 19 12.1597 19C14.6243 19 16.8286 17.6069 18.2961 15.4163C16.6885 13.9172 14.5312 13 12.1597 13C9.78821 13 7.63095 13.9172 6.02332 15.4163ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"></path></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V18H18V10ZM20 18.6667L20.4 19.2C20.5657 19.4209 20.5209 19.7343 20.3 19.9C20.2135 19.9649 20.1082 20 20 20H4C3.72386 20 3.5 19.7761 3.5 19.5C3.5 19.3918 3.53509 19.2865 3.6 19.2L4 18.6667V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V18.6667ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path></svg>
                                </div>

                                <div style="display: flex;" class="dropdown-menu">
                                    <a href="#">My account</a>
                                    <a href="#">Log Out</a>
                                </div>
                            </div>

                        </header>
                        <hr color="E6E6E6" width="100%">
                        <main>
                            <div class="up">
                                <div id = "branch-img">
                                    <img src="../images/branch-image.png" alt = "branch-image" style = "height:35vh, width" >
                                </div>
                                <div id = "info">
                                    <p><a href="/" style = "text-decoration: none; color:black;"><u>Home</u></a> /
                                        <a href="../BranchGrid.html" style = "text-decoration: none; color:black;"><u> Branches</u></a> /
                                        ${escapeHtml(branch.branch_name)}
                                    </p>
                                    <h1>${escapeHtml(branch.branch_name)}</h1>
                                    <p>Location: ${escapeHtml(branch.branch_location)}</p><br>
                                    <div class = "join-buttons">
                                        <button v-if="users" id = "red" @click = "JoinBranch()">
                                            JOIN NOW
                                        </button>
                                        <button v-if="usersJoined" id = "gray" @click = "LeaveBranch()">
                                           LEAVE
                                        </button>
                                        <button v-if="adminOrManagers" style="display:none"></button>
                                        <button v-if="guestUsers" id = "gray">
                                            Sign In to join
                                        </button>
                                    </div>
                                </div>
                            </div>

                        <div class="down">
                            <div>
                                <p><b>About Us</b></p>
                                <p><b>${escapeHtml(branch.branch_description)}</b></p>
                            </div>
                            <div>
                                <p>Location</p>
                                <p>${escapeHtml(branch.branch_location)}</p>
                            </div>
                        </div>
                        </main>
                        <footer>
                            <div class="contactINFO">
                                <div><u><b>Contact Us</b></u></div>
                                <div><u>North Terrace Campus</u></div>
                                <div>Level 4 Hub Central, University of Adelaide</div>
                                <div>General: Care and Share<u>@adelaide.edu.au</u></div>
                            </div>
                            <div><u><b>About us</b></u></div>
                            <div id="ConnectWithUs">
                                <div><u><b>Connect with us</b></u></div> <br>
                                <img src="/images/Facebook.png" alt="facebook-logo">
                                <img src="/images/X.png" alt="x-logo">
                                <img src="/images/Instagram.png" alt="ig-logo">
                            </div>

                        </footer>
                        <script src="/javascripts/join_branch.js"></script>
                    </body>
                    </html>
                `;
                res.send(branchHTML);
            } else {
                res.sendStatus(404);
            }
        });
    });
});

// Join a specific branch
router.post('/JoinBranch', function(req,res,next){
    const branch_id = req.body.branchId;
    const user_id = req.session.userID;
    console.log(branch_id);
    console.log(user_id);
    if (!branch_id){
        return res.status(500).send('Missing branch_id');
    } else if (!user_id){
        return res.status(500).send('Missing user_id');
    }

    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = "INSERT INTO Membership (user_id, branch_id) VALUES(?,?)";
        connection.query(query, [user_id, branch_id], function(err, results){
            connection.release();
            if (err) {
                console.error('Error inserting into Membership: ', err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        });
    });
});

router.get('/getJoinButton/:branch_id', function(req,res,next){
    const user_role = req.session.userRole;
    if(user_role === "admin" || user_role === "manager"){
        const response = {
            button: "adminOrManagers"
        };
        res.send(response);
    }else if(user_role === "user"){
        const branch_id = req.params.branch_id;
        const user_id = req.session.userID;
        const query = 'SELECT Membership_id FROM Membership WHERE user_id = ? and branch_id = ?';
        const values = [user_id, branch_id];
        const connection = mysql.createConnection({
            host: 'localhost',
            database: 'CareAndShare'
        });
        connection.query(query, values, function (error, results, fields){
            connection.end();
            if (error) {
                console.error('Error finding if member has joined the branch:', error);
                res.sendStatus(500);
                return;
            }
            if(results.length > 0){
                const response = {
                    button: "usersJoined"
                };
                res.send(response);
            }else{
                const response = {
                    button: "users"
                };
                res.send(response);
            }
        });
    }else{
        const response = {
            button: "guestUsers"
        };
        res.send(response);
    }
});


// Get branch members data
router.get('/branch_members', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.sendStatus(500);
        }

        const user_id = req.session.userID;

        // Get branch_id of the branch managed by the branch manager
        const branch_query = `
            SELECT branch_id FROM Branch_Management WHERE user_id = ?
        `;
        connection.query(branch_query, [user_id], function(err, results, fields) {
            if (err) {
                console.error('Error getting branch_id:', err);
                connection.release();
                return res.sendStatus(500);
            }

            if (results.length === 0) {
                // No branch found for this manager
                connection.release();
                return res.status(404).send("This user is not managing any branch.");
            }

            const branch_id = results[0].branch_id;

            // Get members of the branch
            const query = `
                SELECT
                    User.user_id,
                    User.first_name,
                    User.last_name,
                    User.password,
                    User.phone_number,
                    User.location,
                    User.email_address,
                    User.avatar,
                    User.isManager,
                    Membership.branch_id,
                    Branch.branch_name
                FROM
                    User
                JOIN
                    Membership ON User.user_id = Membership.user_id
                JOIN
                    Branch ON Branch.branch_id = Membership.branch_id
                WHERE Branch.branch_id = ?
            `;

            connection.query(query, [branch_id], function(err, results, fields) {
                connection.release();

                if (err) {
                    console.error('Error checking database:', err);
                    return res.sendStatus(500);
                }

                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.status(200).send('This branch has no members.');
                }
            });
        });
    });
});


//Edit branch details
router.post('/edit_branch', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            console.error('Error getting connection from pool:', err);
            connection.release();
            return res.sendStatus(500);
        }

        const user_id = req.session.userID;
        if (!user_id) {
            connection.release();
            return res.status(400).send('User ID is required.');
        }
        console.log('Current user ID:', user_id);

        const management_query = "SELECT branch_id FROM Branch_Management WHERE user_id = ?";
        connection.query(management_query, [user_id], function(err, results) {
            if (err) {
                console.error('Error querying Branch_Management table:', err);
                connection.release();
                return res.sendStatus(500);
            }

            if (results.length === 0) {
                connection.release();
                return res.status(403).send('User is not a manager');
            }

            const branch_id = results[0].branch_id;
            console.log('Branch ID for user:', branch_id);

            const { branch_name, branch_email, branch_contact, branch_location, branch_description } = req.body;
            const update_query = `UPDATE Branch SET branch_name = ?, branch_location = ?, branch_email = ?, branch_phone_number = ?, branch_description = ? WHERE branch_id = ?`;
            const values = [branch_name, branch_location, branch_email, branch_contact, branch_description, branch_id];

            connection.query(update_query, values, function(error, results) {
                connection.release();
                if (error) {
                    console.error('Error editing branch details in database:', error);
                    return res.sendStatus(500);
                }
                console.log('Branch edited successfully:', results);
                res.redirect('../ManagerViewBranchInfo.html');
            });
        });
    });
});



// Remove a member from a branch
router.get('/remove_members/:user_id', function(req,res,next){
    const user_id = req.params.user_id;
    req.pool.getConnection(function(err,connection){
        if (err) {
            console.error('Error getting database connection: ', err);
            return res.sendStatus(500);
        }

        const query = `
            DELETE FROM Membership WHERE user_id = ?
        `;

        connection.query(query, [user_id], function(err,results){
            connection.release();

            if (err) {
                console.error('Error removing member:', err);
                return res.sendStatus(500);
            }

            if (results.affectedRows === 0) {
                return res.status(404).send('Member not found.');
            }

            res.sendStatus(200);
        });
    });
});


router.post('/getBranchNameFromBranchID', function(req,res,next){
    const userID = req.body.branchID;
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = `SELECT Branch.branch_name FROM Branch WHERE branch_id=?`;


        connection.query(query, userID, function(err, results){
            connection.release();
            if (err) {
                console.error('Error fetching data from announcement', err);
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });
});



router.post('/getBranchInfo', function(req,res,next){
    const branchID = req.body.branchID;
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = `SELECT * FROM Branch WHERE branch_id=?`;


        connection.query(query, branchID, function(err, results){
            connection.release();
            if (err) {
                console.error('Error fetching data from announcement', err);
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });
});








module.exports = router;