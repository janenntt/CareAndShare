var express = require("express");
var router = express.Router();

router.post('/addAnnouncement', function(req,res,next){
    const branch_id = req.body.branchID;
    const title = req.body.title;
    const message = req.body.message;

    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = "INSERT INTO Announcement (message, branch_id, title) VALUES (?,?,?)";
        connection.query(query, [message, branch_id, title], function(err, results){
            connection.release();
            if (err) {
                console.error('Error inserting into Announcement', err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        });
    });
});


router.post('/getAnnouncementInfo', function(req,res,next){
    const userID = req.body.userID;
    console.log(userID);
    req.pool.getConnection(function(err, connection){
        if (err){
            console.error('Error getting connection:', err);
            return res.sendStatus(500);
        }

        const query = ` SELECT a.*, b.branch_name
                        FROM
                            Announcement a
                        INNER JOIN
                            Membership m ON a.branch_id = m.branch_id
                        INNER JOIN
                            User u ON m.user_id = u.user_id
                        INNER JOIN
                            Branch b ON b.branch_id = m.branch_id
                        WHERE u.user_id = ?`;


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


module.exports = router;