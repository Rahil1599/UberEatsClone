const mysql = require('mysql');
var db;

function dbConnectionProvider() {
    if (!db) {
        db = mysql.createPool({
            connectionLimit: 10,
            host: process.env.PRODUCTION ? "ubereats.cdrnf3lnnwzp.us-east-2.rds.amazonaws.com" : "localhost",
            user: process.env.PRODUCTION ? "admin" : "root",
            password: process.env.PRODUCTION ? "password" : "",
            database:"ubereats"
        });
    }
    return db;
}
module.exports = dbConnectionProvider();


