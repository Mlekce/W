const bcrypt = require("bcrypt");
const getPool = require("../data/database");
const sendMail = require("../utils/nodeMailer");
const { generateEmailToken, verifyToken } = require("../utils/jwt");
const moment = require("moment");
require("dotenv").config();

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
            return { check: hpwd, error: null };

        } catch (err) {
            return { check: null, error: `Error hashing password! Message: ${err}` };
        }
    }

    async checkIfUserExists() {
        const pool = await getPool();
        try {
            let querry = `SELECT email FROM Customers WHERE email = (?)`
            const [rows] = await pool.execute(querry, [this.email]);
            if (rows.length !== 0) {
                return { error: "User already exists! " }
            }
            return { error: null };
        } catch (error) {
            return { error: `Error connecting to database. Message: ${error}` }
        }
    }

    async addCustomer(hashedPassword) {
        const pool = await getPool();
        let arr = [this.fname, this.lname, this.email, hashedPassword, this.phone, this.address, this.city, this.pcode, this.country];
        try {
            let querry = `INSERT INTO 
            Customers (first_name, last_name, email, password_hash, phone, address, city, postal_code, country)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await pool.execute(querry, arr);
            console.log("Inserted customer by id:", result.insertId);
            return { result: result.insertId, error: null }
        } catch (error) {
            console.error(`Error inserting new customer ${error}`);
            return { result: null, error: error }
        }
    }

    async findUser() {
        const pool = await getPool();
        try {
            let querry = `SELECT id FROM Customers WHERE email = (?)`
            const [result] = await pool.execute(querry, [this.email]);
            if (result.length === 0) {
                return null
            }
            return result[0].id;
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async sendConfirmationEmail() {
        let secretKey = process.env.EMAIL_SECRET_KEY;
        let customerId = await this.findUser();
        if (customerId === null) {
            return { status: false, error: 'User not found' }
        }
        const token = generateEmailToken(customerId, secretKey);
        const expireAt = moment().add(1, 'hour').unix();
        const pool = await getPool();
        const query = `
        INSERT INTO EmailVerificationTokens (customer_id, token, expires_at)
        VALUES (?, ?, ?);
      `;
        try {
            await pool.execute(query, [customerId, token, expireAt])
        }
        catch (error) {
            return { status: false, error: error }
        };
        try {
            await sendMail(this.email, token);
        }
        catch (error) {
            if (error) {
                return { status: false, error: error }
            }
        };
        return { status: true, error: null }
    }

    static async verifyEmail(token) {
        const pool = await getPool();
        let query = `SELECT * FROM EmailVerificationTokens WHERE token = (?)`;
        try {
            const [result] = await pool.execute(query, [token]);
            if (result.length === 0) {
                return { status: false, error: "Invalid token" };
            }

            const tokenData = result[0];
            if (moment().unix() > tokenData.expires_at) {
                return { status: false, error: "Token has expired" };
            }

            const customerQuery = `SELECT email_confirmed FROM Customers WHERE customer_id = (?)`;
            const [customerResult] = await pool.execute(customerQuery, [tokenData.customer_id]);
            if (customerResult.length === 0) {
                return { status: false, error: "Customer not found" };
            }
            
            const customer = customerResult[0];
            if (customer.email_confirmed) {
                return { status: false, error: "Email is already confirmed" };
            }

            const updateQuery = `UPDATE Customers SET email_confirmed = TRUE, email_token = ? WHERE customer_id = ?`;
            await pool.execute(updateQuery, [token, tokenData.customer_id]);
            
            const deleteTokenQuery = `DELETE FROM EmailVerificationTokens WHERE token = ?`;
            await pool.execute(deleteTokenQuery, [token]);
            
            return { status: true, message: "Email successfully confirmed" };
            
        } catch (error) {
            console.error(error);
            return { status: false, error: "An error occurred while verifying the email" };
        }
    }

}


module.exports = Customer