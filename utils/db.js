var mysql = require('mysql');

var pool = {
    host: 'localhost',
    database: 'CareAndShare'
};

var dbConnectionPool = mysql.createPool(pool);

exports.pool = pool;
exports.dbConnectionPool = dbConnectionPool;
