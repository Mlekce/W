const express = require("express");
const router = express.Router();
const controllers = require("../controllers/default");
const upload = require("../utils/multerMiddleware");

router.get("/", controllers.getHome);
router.get("/signup", controllers.getSignup);
router.post("/signup", controllers.postSignup);
router.get("/login", controllers.getLogin);
router.get("/confirm/:id", controllers.activateAccount)

module.exports = router;