function getHome(req, res) {
    res.send("Hello from express Server")
}

function getSignup(req, res) {
    res.render("signupPage")
}



module.exports = {
    getHome,
    getSignup
}