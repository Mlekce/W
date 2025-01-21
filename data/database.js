const mysql2 = require("mysql2/promise");

async function getPool() {
    const pool = mysql2.createPool({
        host: 'localhost',
        user: 'root',
        password: 'my-secret-pw',
        database : "webshop",
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    return pool;
}

module.exports = getPool;
