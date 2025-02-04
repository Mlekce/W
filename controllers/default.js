const { validationResult } = require("express-validator");
const Customer = require("../models/customers");


function getHome(req, res) {
    res.render("homePage");
    return
}

function getSignup(req, res) {
    res.render("signupPage", { error: null })
}

async function postSignup(req, res) {
    let result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(500).render("login", { error: "Error validating input." })
    }

    let data = req.body;
    let newCustomer = new Customer(
        data.fname,
        data.lname,
        data.passwd,
        data.cpasswd,
        data.email,
        data.phone,
        data.country,
        data.city,
        data.postal_code,
        data.address);

    let { check, error } = newCustomer.comparePasswords();
    if (!check) {
        res.render("signupPage", { error: error || null });
        return
    }

    ({ error } = await newCustomer.checkIfUserExists());
    if (error) {
        res.render("signupPage", { error: error || null });
        return
    }

    ({ check, error } = await newCustomer.hashPassword());
    if (check === null) {
        res.status(500).render("500", { error: error || null });
        return
    }

    ({ result, error } = await newCustomer.addCustomer(check));
    if (result) {
        let status;
        ({ status, error } = await newCustomer.sendConfirmationEmail())
        if (status) {
            res.redirect("/login");
            return
        }
        else {
            res.status(500).render("500", { error: error || null });
            return
        }
    }
    else {
        res.status(500).render("500", { error: error || null });
        return
    }
}

function getLogin(req, res) {
    res.render("loginPage", { error: null });
    return
}

async function postLogin(req, res) {
    let result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).render("loginPage", { error: "Error validating input." });
        return
    }
    let email = req.body.email;
    let passwd = req.body.passwd;
    let { isAuth, account } = await Customer.loginUser(email, passwd);
    if (isAuth) {
        res.locals.isAuth = isAuth;
        res.locals.account = account;
        res.redirect("/");
        return
    } else {
        res.render("loginPage", { error: "Wrong email or password." });
        return
    }
}

async function activateAccount(req, res) {
    const token = String(req.params.id);
    let verify = await Customer.verifyEmail(token);
    if (verify.hasOwnProperty("message")) {
        console.log(verify.message)
        res.status(200).redirect("/login");
        return
    }
    else {
        res.status(500).render(500, { error: verify.error || null });
        return
    }
}

module.exports = {
    getHome,
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    activateAccount
}