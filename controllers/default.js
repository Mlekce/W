const Customer = require("../models/customers")
function getHome(req, res) {
    res.send("Hello from express Server")
}

function getSignup(req, res) {
    res.render("signupPage")
}

function postSignup(req, res) {
    let data = req.body;
    console.log(data);
    let newCustomer = new Customer(data.fname, data.lname, data.passwd, data.cpasswd, data.email, data.phone, data.country, data.city, data.postal_code, data.address);
    newCustomer.addCustomer();
    res.redirect("/login");
}

module.exports = {
    getHome,
    getSignup,
    postSignup
}