function getHome(req, res) {
    res.send("Hello from express Server")
}

function getSignup(req, res) {
    res.render("signupPage")
}

function postSignup(req, res){
    return
}

module.exports = {
    getHome,
    getSignup
}