const mysql2 = require("mysql2/promise");
require("dotenv").config();

async function getPool() {
    const pool = mysql2.createPool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.PASSWORD,
        database : process.env.DATABASE,
        port: process.env.PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    return pool;
}

module.exports = getPool;
