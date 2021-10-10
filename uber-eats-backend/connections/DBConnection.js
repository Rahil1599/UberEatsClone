mysql = require('mysql');
var db;

function dbConnectionProvider() {
    if (!db) {
        db = mysql.createPool({
            connectionLimit: 10,
            host: "localhost",
            user: "root",
            password: "",
            database:"ubereats"
        });
    }
    return db;
}
module.exports = dbConnectionProvider();


