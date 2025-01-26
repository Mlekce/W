const mysql2 = require("mysql2/promise");
require("dotenv").config();

async function getPool() {
    const pool = mysql2.createPool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database : process.env.SQL_DATABASE,
        port: process.env.SQL_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    return pool;
}

module.exports = getPool;
