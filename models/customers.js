const bcrypt = require("bcrypt");
const getPool = require("../data/database");

class Customer {
    constructor(fname, lname, passwd, cpasswd, email, phone, country, city, pcode, address) {
        this.fname = fname
        this.lname = lname
        this.passwd = passwd
        this.cpasswd = cpasswd
        this.email = email
        this.phone = phone
        this.country = country
        this.city = city
        this.state = null
        this.pcode = pcode
        this.address = address
    }

    comparePasswords() {
        if (this.passwd.length < 8 || this.cpasswd.length < 8) {
            throw new Error("Passwords must be at least 8 characters long.");
        }
        if (this.passwd !== this.cpasswd) {
            throw new Error("Passwords do not match.");
        }
        return true;
    }

    async hashPassword() {
        try {
            this.comparePasswords();
            const hpwd = await bcrypt.hash(this.passwd, 10);
            return hpwd;

        } catch (error) {
            throw new Error("Error hashing password!");
        }
    }

    async addCustomer() {
        this.comparePasswords();
        await this.checkIfUserExists();
        const hashedPassword = await this.hashPassword();
        const pool = await getPool();
        try {
            let querry = `INSERT INTO 
            Customers (first_name, last_name, email, password_hash, phone, address, state, city, postal_code, country)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await pool.execute(querry,
                [this.fname, this.lname, this.email, hashedPassword, this.phone, this.address, this.state, this.city, this.pcode, this.country]);

            console.log("Inserted customer by id:", result.insertId)
        } catch (error) {
            console.error(`Error inserting new customer ${error}`);
            throw new Error;
        }
    }

    async checkIfUserExists() {
        const pool = await getPool();
        try {
            let querry = `SELECT email FROM Customers WHERE email = (?)`
            const [rows] = await pool.execute(querry, [this.email]);
            if (rows.length !== 0) {
                throw new Error("User already exists!")
            }
            return false;
        } catch (error) {
            throw new Error("Error connecting to database.");
        }
    }
}


module.exports = Customer