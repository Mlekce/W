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
        this.pcode = pcode
        this.address = address
    }

    comparePasswords() {
        if (this.passwd.length < 8 || this.cpasswd.length < 8) {
            return { check: false, error: "Passwords must be at least 8 characters long." }
        }
        if (this.passwd !== this.cpasswd) {
            return { check: false, error: "Passwords do not match." }
        }
        return { check: true, error: null }
    }

    async hashPassword() {
        try {
            this.comparePasswords();
            const hpwd = await bcrypt.hash(this.passwd, 10);
            return { h_check: hpwd, h_error: null };

        } catch (err) {
            return { h_check: null, h_error: `Error hashing password! Message: ${err}` };
        }
    }

    async checkIfUserExists() {
        const pool = await getPool();
        try {
            let querry = `SELECT email FROM Customers WHERE email = (?)`
            const [rows] = await pool.execute(querry, [this.email]);
            if (rows.length !== 0) {
                return { u_err: "User already exists! " }
            }
            return { u_err: null };
        } catch (error) {
            return { u_err: `Error connecting to database. Message: ${error}` }
        }
    }

    async addCustomer() {
        const pool = await getPool();
        let arr = [this.fname, this.lname, this.email, hashedPassword, this.phone, this.address, this.city, this.pcode, this.country];
        try {
            let querry = `INSERT INTO 
            Customers (first_name, last_name, email, password_hash, phone, address, city, postal_code, country)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await pool.execute(querry, arr);
            console.log("Inserted customer by id:", result.insertId)
        } catch (error) {
            console.error(`Error inserting new customer ${error}`);
            throw new Error;
        }
    }
}


module.exports = Customer