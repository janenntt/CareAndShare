var express = require("express");
var router = express.Router();
const mysql = require('mysql');
const db = require("../utils/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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


// This is for each manager view their events from their branch.
router.post('/getEventInfoForEachBranch', function(req,res,next){
    const branchID = req.body.branchID;
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = "SELECT * FROM Event WHERE branch_id = ?";
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

// Create events
const defaultAvatar = '../uploads/logo.png';
router.post('/createEvent', upload.single('picture'), function(req, res, next){
    req.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return res.status(500).send("An internal server error occurred.");
        }

        console.log(req.body);
        const event_name = req.body.eventName;
        const event_date = req.body.eventDate;
        const event_time = req.body.eventTime;
        const event_location = req.body.eventLocation;
        const event_description = req.body.eventDescription;
        const is_private = req.body.isPrivate === 'true' || req.body.isPrivate === true ? 1 : 0;
        const branch_id = req.body.branchID;
        const picture = req.file ? `/uploads/${req.file.filename}` : defaultAvatar;

        // Query to get branch name
        const branchQuery = "SELECT branch_name FROM Branch WHERE branch_id = ?";
        connection.query(branchQuery, [branch_id], function(err, branchResults) {
            if (err) {
                console.log(err);
                connection.release();
                return res.status(500).send("Internal Server Error Occurred while fetching branch name.");
            }

            if (branchResults.length === 0) {
                connection.release();
                return res.status(404).send("Branch not found.");
            }

            const branch_name = branchResults[0].branch_name;
            console.log("The first query has been passed");

            // Insert event details
            var query = "INSERT INTO Event (event_name, event_date, event_time, event_location, event_description, is_private, poster, branch_id) VALUES (?,?,?,?,?,?,?,?)";
            connection.query(query, [event_name, event_date, event_time, event_location, event_description, is_private, picture, branch_id], function (err, rows, fields) {
                if (err){
                    console.log(err);
                    connection.release();
                    return res.status(500).send("Internal Server Error Occurred while inserting event.");
                }
                res.status(200).json({ message: "Event created successfully", branch_name: branch_name });
                connection.release();
            });
        });
    });
});

// GET EVENT FOR EventLists.html /////
router.get('/getEventForGuestUser', function(req,res,next){
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = "SELECT * FROM Event WHERE is_private = 0";
        connection.query(query, function(err, results){
            connection.release();
            if (err) {
                console.error('Error fetching data from announcement', err);
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });
});


router.get('/getEventForAdmin', function(req,res,next){
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = "SELECT * FROM Event";
        connection.query(query, function(err, results){
            connection.release();
            if (err) {
                console.error('Error fetching data from announcement', err);
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });
});

router.post('/getEventForManager', function(req,res,next){

    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = `SELECT
                            e.event_id,
                            e.event_name,
                            e.event_description,
                            e.event_date,
                            e.event_time,
                            e.event_location,
                            e.is_private,
                            e.poster,
                            e.branch_id
                        FROM
                            Branch u
                        JOIN
                            Event e ON e.branch_id = u.branch_id
                        WHERE
                            u.branch_id = ?
                        UNION

                        SELECT
                            e.event_id,
                            e.event_name,
                            e.event_description,
                            e.event_date,
                            e.event_time,
                            e.event_location,
                            e.is_private,
                            e.poster,
                            e.branch_id
                        FROM
                            Event e
                        WHERE
                            e.is_private = 0
                        `;

        connection.query(query,[req.body.branchID], function(err, results){
            connection.release();
            if (err) {
                console.error('Error fetching data from announcement', err);
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });
});


router.post('/getEventForNormalUser', function(req,res,next){
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = `
            SELECT
                e.event_id,
                e.event_name,
                e.event_description,
                e.event_date,
                e.event_time,
                e.event_location,
                e.is_private,
                e.poster,
                e.branch_id
            FROM
                User u
            JOIN
                Membership m ON u.user_id = m.user_id
            JOIN
                Branch b ON b.branch_id = m.branch_id
            JOIN
                Event e ON e.branch_id = b.branch_id
            WHERE
                u.user_id = ?
                AND e.is_private = 1

            UNION

            SELECT
                e.event_id,
                e.event_name,
                e.event_description,
                e.event_date,
                e.event_time,
                e.event_location,
                e.is_private,
                e.poster,
                e.branch_id
            FROM
                Event e
            WHERE
                e.is_private = 0`;

        connection.query(query, [req.body.userID], function(err, results){
            connection.release();
            if (err) {
                console.error('Error fetching data from announcement', err);
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });
});

router.get('/getEventInfo', function(req, res, next){
    const userRole = req.session.userRole;
    if(userRole != "manager"){
        res.sendStatus(403).json({ error: 'You are not a manager' });
    }
    const eventId = req.query.eventId;
    console.log(eventId);
    const connection = mysql.createConnection({
        host: 'localhost',
        database: 'CareAndShare'
    });
    const query = 'SELECT * FROM Event WHERE event_id = ?';
    connection.query(query, eventId, function(err, results, fields) {
        connection.end();
        if (err) {
            console.error('Error editing Branch info into database:', err);
            res.sendStatus(500);
            return;
        }
        res.send(results[0]);
    });
});

router.post('/ManagerEditEvent', function(req, res, next){
    const userRole = req.session.userRole;
    if(userRole != "manager"){
        res.sendStatus(403).json({ error: 'You are not a manager' });
    }
    req.pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log(err);
            return res.status(500).send("An interval server error occurred.");
        }
        const event_id = req.body.eventId;
        const event_name = req.body.eventName;
        const event_date = req.body.eventDate;
        const event_time = req.body.eventTime;
        const event_location = req.body.eventLocation;
        const event_description = req.body.eventDescription;
        const is_private = req.body.isPrivate;
        const poster = req.body.poster;
        var query = "UPDATE Event SET event_name = ?, event_date = ?, event_time = ? , event_location = ?, event_description = ?, is_private = ?, poster = ? WHERE event_id = ?";
        connection.query( query,[event_name, event_date, event_time, event_location, event_description, is_private, poster, event_id] , function (err, rows, fields) {
            if (err){
                console.log(err);
                connection.release();
                return res.status(500).send("Internal Server Error Occurred.");
            }
            console.log(rows);
            res.sendStatus(200);
            connection.release();
        });
    });
});

router.post('/ManagerDeleteEvent', function(req, res, next){
    const userRole = req.session.userRole;
    if(userRole != "manager"){
        res.sendStatus(403).json({ error: 'You are not a manager' });
    }
    const eventId = req.body.eventId;
    const connection = mysql.createConnection({
      host: 'localhost',
      database: 'CareAndShare'
    });

    const query = "DELETE FROM Event WHERE event_id = ?";
    connection.query(query, [eventId], function(err, results, fields){
      console.log("This is called");
      if (err) {
        console.error('Error deleting branch:',err);
        connection.end();
        res.sendStatus(500);
        return;
      }
      if (results){
        res.sendStatus(200);
      } else {
        connection.end();
        res.sendStatus(401);
      }
    });
});

// Event details pages
router.get("/event_details/:event_id", function(req,res,next){
    const event_id = req.params.event_id;
    if (!event_id){
        res.sendStatus(400);
    }

    req.pool.getConnection(function(err,connection){
        if(err) {
            connection.release();
            return res.sendStatus(500);
        }

        const query = `
            SELECT Event.event_name, Event.event_date, Event.event_time, Event.event_location,
                   Event.event_description, Event.is_private, Event.poster, Event.branch_id, Branch.branch_name
            FROM Event
            JOIN Branch ON Event.branch_id = Branch.branch_id
            WHERE Event.event_id = ?
        `;

        connection.query(query, event_id ,function(err,results,fields){
            if(err){
                console.error('Error fetching event details: ',err);
                return res.sendStatus(500);
            }
            if (results.length > 0){
                const event = results[0];
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

                const eventHTML = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>About Event</title>
                        <link rel="stylesheet" href="../stylesheets/headerAndFooter.css">
                        <link rel="stylesheet" href="../stylesheets/event_details.css">
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
                        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
                        <link rel="stylesheet" href="https://aui-cdn.atlassian.com/aui-adg/6.0.13/css/aui.min.css" />
                        <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
                        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet">
                        <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
                    </head>
                    <body>
                        <header>
                            <div class="left_header">
                                <nav>
                                    <a href = "/">
                                        <img src="/images/logo.png" id="logo" alt="logo">
                                    </a>
                                    <a href = "../AboutUs.html" id="About">About</a>
                                    <a href = "../EventList.html" id="Events">Events</a>
                                    <a href = "../BranchGrid.html" id="Branches">Branches</a>
                                </nav>
                            </div>

                            <div class="right_header">
                                <div class="right_header1">
                                    <form>
                                        <img src="/images/Search.png" id="Search" alt="Search">
                                        <input  type="text" placeholder="Search...">
                                    </form>
                                </div>

                                <div class="right_header2">
                                    <div v-if="isNotLoggedIn" class="guest">
                                        <a href="../signup_login/login.html" id="Login" style="text-decoration: none; color:black;">Login</a>
                                    </div>

                                    <div v-if="isManager" class="manager">
                                        <div class="icons">
                                            <img src="/images/downArrow.png" id="downArrow" alt="arrow" @click="hideDropDown()" >
                                            <img src="/images/account.png" id="account" alt="account">
                                        </div>

                                        <div style="display:none;" class="dropdown-menu">
                                            <a href="../MyAccount.html">My account</a>
                                            <a @click="DirectToBranch()">My branch</a>
                                            <a href="../Dashboard.html">My Dashboard</a>
                                            <a @click="logout()">Log Out</a>
                                        </div>
                                    </div>

                                    <div  v-if="isAdmin" id="admin">

                                        <div class="icons">
                                            <img src="/images/downArrow.png" id="downArrow" alt="arrow" @click="hideDropDown()">
                                            <img src="/images/account.png" id="account" alt="account">
                                        </div>

                                        <div style="display: none;" class="dropdown-menu">
                                            <a href="../MyAccount.html">My account</a>
                                            <a href="../Dashboard.html">My Dashboard</a>
                                            <a @click="logout()">Log Out</a>
                                        </div>
                                    </div>

                                    <div  v-if="isUser" id="user">
                                        <div class="icons">
                                            <img src="/images/downArrow.png" id="downnArrow" alt="arrow" @click="hideDropDown()">
                                            <img src="/images/account.png" id="account" alt="account">
                                            <img src="/images/notification.png" id="notification" alt="notification">
                                        </div>

                                        <div style="display: none;" class="dropdown-menu">
                                            <a href = "../MyAccount.html">My account</a>
                                            <a @click="logout()">Log Out</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>
                        <hr color="E6E6E6" width="100%">

                        <main id = "app">
                            <div id = "event-details-up">
                                <div class ="event-details-up-left">
                                    <img style = "width:25vw" src = ${event.poster} alt ="event-image">
                                </div>
                                <div class ="event-details-up-right">
                                    <p><a href="/" style = "text-decoration: none; color:black;"><u>Home</u></a>/
                                        <a href="../EventList.html" style = "text-decoration: none; color:black;"><u>Events</u></a>/
                                        ${escapeHtml(event.event_name)}
                                    </p>
                                    <h1>${escapeHtml(event.event_name)}</h1>
                                    <p> Hosted by:
                                        <a href="/branch_details/${event.branch_id}" style="font-weight: bold; color:black">${escapeHtml(event.branch_name)}</a>
                                    </p>
                                    <p>Ticket Price: <b>FREE</b></p>
                                    <button v-if="buttonState === 'rsvp'" type="button" id="rsvp-event-btn" @click="handleRSVP">RSVP NOW</button>
                                    <button v-else-if="buttonState === 'rsvpd'" type="button" id="rsvp-event-btn" @click="handleRSVP" style="background-color:grey">RSVP'd</button>
                                    <button v-else-if="buttonState === 'viewRSVP'" type="button" id="rsvp-event-btn" @click="viewRSVPList">VIEW RSVP</button>
                                    <button v-else-if="buttonState === 'signIn'" type="button" id="rsvp-event-btn" disabled>Sign in to RSVP</button>
                                </div>
                            </div>
                            <div id = "event-details-down">
                                <div class = "event-details-down-left">
                                    <div class = "event-description">
                                        <p><b>Event Description</b></p>
                                        <p>${escapeHtml(event.event_description)}</p>
                                    </div>
                                </div>
                                <div class="event-details-down-right">
                                    <div class = "event-datetime">
                                        <p><b>Date and Time</b></p>
                                        <p>${escapeHtml(event.event_date)} at ${escapeHtml(event.event_time)}</p>
                                    </div>
                                    <br>
                                    <div class="event-location">
                                        <p><b>Location</b></p>
                                        <p>${escapeHtml(event.event_location)}</p>
                                    </div>
                                </div>
                            </div>
                        </main>
                        <footer>
                            <div class="contactINFO">
                                <div><u><b>Contact Us</b></u></div>
                                <div><u>North Terrace Campus</u></div>
                                <div>Level 4 Hub Central, University of Adelaide</div>
                                <div>General: Care&Share<u>@adelaide.edu.au</u></div>
                            </div>
                            <div><u><b>About us</b></u></div>
                            <div id="ConnectWithUs">
                                <div><u><b>Connect with us</b></u></div> <br>
                                <img src="/images/Facebook.png">
                                <img src="/images/X.png">
                                <img src="/images/Instagram.png">
                            </div>

                        </footer>
                        <script src="/javascripts/rsvp_event.js"></script>

                    </body>
                    </html>
                `;
                res.send(eventHTML);
            } else {
                res.sendStatus(404);
            }
        });
    });
});


router.post('/getAllEmailOfUsersOfBranch', function(req,res,next){
    console.log(req.body);
    let branchID = req.body.branchID;
    console.log(branchID);
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }
        const query = `SELECT
                            u.email_address
                        FROM
                            Membership m
                        INNER JOIN
                            User u ON m.user_id = u.user_id
                        WHERE
                            m.branch_id = ?`;
        connection.query(query, [branchID], function(err, results) {
            connection.release();
            if (err) {
                console.error('Error getting email', err);
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });
});

// Get event attendees (RSVP) for the manager's branch
router.get('/event_rsvp', function(req, res, next) {
    req.pool.getConnection(function(err, connection) {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.sendStatus(500);
        }

        const manager_id = req.session.userID;

        const branch_query = `
            SELECT branch_id FROM Branch_Management WHERE user_id = ?
        `;
        connection.query(branch_query, [manager_id], function(err, branchResults) {
            if (err) {
                console.error('Error getting branch_id:', err);
                connection.release();
                return res.sendStatus(500);
            }

            if (branchResults.length === 0) {
                // No branch found for this manager
                connection.release();
                return res.status(404).send("This user is not managing any branch.");
            }

            const branch_id = branchResults[0].branch_id;

            // Get RSVPs for events in the manager's branch
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
                    RSVP ON User.user_id = RSVP.user_id
                JOIN
                    Event ON RSVP.event_id = Event.event_id
                JOIN
                    Branch ON Event.branch_id = Branch.branch_id
                WHERE Branch.branch_id = ?
            `;

            connection.query(query, [branch_id], function(err, results, fields) {
                connection.release();

                if (err) {
                    console.error('Error fetching event RSVPs:', err);
                    return res.sendStatus(500);
                }

                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.status(200).send('This event has no attendees.');
                }
            });

        });
    });
});



router.get('/view_rsvp/:event_id', function(req, res, next) {
    const eventId = req.params.event_id;
    req.pool.getConnection(function(err, connection) {
        if (err) {
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = `
            SELECT
                User.user_id, User.first_name, User.last_name, User.email_address, User.location, User.phone_number
            FROM
                RSVP
            JOIN
                User
            ON
                RSVP.user_id = User.user_id
            WHERE
                RSVP.event_id = ?
        `;
        connection.query(query, [eventId], function(err, results) {
            connection.release();
            if (err) {
                console.error('Error fetching RSVP list:', err);
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });
});



router.post('/RSVPEvent', function(req,res,next){
    const event_id = req.body.event_id;
    const user_id = req.session.userID;

    if (!event_id) {
        return res.status(400).send('Missing event_id.');
    } else if (!user_id) {
        return res.status(400).send('Missing user_id');
    }

    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection: ',err);
            return res.sendStatus(500);
        }

        const query = `
            INSERT INTO RSVP (user_id, event_id) VALUES(?,?)
        `;

        connection.query(query, [user_id, event_id], function(err,results){
            connection.release();
            if (err) {
                console.error('Error inserting into RSVP: ', err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        });
    });
});


router.post('/unRSVPEvent', function(req,res,next){
    const event_id = req.body.event_id;
    const user_id = req.session.userID;

    if (!event_id) {
        return res.status(400).send('Missing event_id.');
    } else if (!user_id) {
        return res.status(400).send('Missing user_id');
    }

    req.pool.getConnection(function(err, connection){
        if (err) {
            console.error('Error getting connection: ', err);
            return res.sendStatus(500);
        }

        const query = `
            DELETE FROM RSVP WHERE user_id = ? AND event_id = ?;
        `;

        connection.query(query, [user_id, event_id], function(err, results){
            connection.release();
            if (err) {
                console.error('Error deleting from RSVP: ',err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        });
    });
});


// Get RSVP button state
router.get('/getRSVPButton/:event_id', function(req, res, next) {
    const user_role = req.session.userRole;

    if (user_role === "admin" || user_role === "manager") {
        return res.json({ button: "viewRSVP" });
    } else if (user_role === "user") {
        const event_id = req.params.event_id;
        const user_id = req.session.userID;

        req.pool.getConnection(function(err, connection) {
            if (err) {
                console.error('Error getting connection:', err);
                return res.sendStatus(500);
            }

            const query = 'SELECT * FROM RSVP WHERE user_id = ? AND event_id = ?';
            connection.query(query, [user_id, event_id], function(err, results) {
                connection.release();
                if (err) {
                    console.error('Error checking RSVP:', err);
                    return res.sendStatus(500);
                }

                if (results.length > 0) {
                    res.json({ button: "rsvpd" });
                } else {
                    res.json({ button: "rsvp" });
                }
            });
        });
    } else {
        res.json({ button: "signIn" });
    }
});


router.post('/getEventInfo', function(req,res,next){
    const eventID = req.body.eventID;
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = "SELECT * FROM Event WHERE event_id = ?";
        connection.query(query, eventID, function(err, results){
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