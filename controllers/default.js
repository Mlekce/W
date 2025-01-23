const Customer = require("../models/customers");


function getHome(req, res) {
    res.send("Hello from express Server")
}

function getSignup(req, res) {
    res.render("signupPage", {error : null})
}

async function postSignup(req, res) {
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

    let { u_err } = await newCustomer.checkIfUserExists();
    if (u_err) {
        res.render("signupPage", { error: u_err || null });
        return
    }

    let { h_check, h_error } = await newCustomer.hashPassword();
    if (h_check === null) {
        res.status(500).render("500", { error: h_error || null });
        return
    }

    newCustomer.addCustomer();
    res.redirect("/login");
}

function getLogin(req, res){
    res.send("Login not yet implemented!")
}

module.exports = {
    getHome,
    getSignup,
    postSignup,
    getLogin
}