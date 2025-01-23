const Customer = require("../data/database")
function getHome(req, res) {
    res.send("Hello from express Server")
}

function getSignup(req, res) {
    res.render("signupPage")
}

function postSignup(req, res) {
    let data = req.body;
    let newCustomer = new Customer(data.fname, data.lname, data.passwd, data.cpasswd, data.email, data.phone, data.country, data.city, data.state, data.pcode, data.address);
    newCustomer.addCustomer()
    return
}

module.exports = {
    getHome,
    getSignup,
    postSignup
}