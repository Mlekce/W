const express = require("express");
const router = express.Router();
const controllers = require("../controllers/default");
const upload = require("../utils/multerMiddleware");
const { body } = require("express-validator");

router.get("/", controllers.getHome);

router.get("/signup", controllers.getSignup);
router.post("/signup",
    body('fname').escape().trim().notEmpty(),
    body('lname').escape().trim().notEmpty(),
    body('passwd').escape().trim().notEmpty().isLength({ min: 8 }),
    body('cpasswd').escape().trim().notEmpty().isLength({ min: 8  }),
    body('email').escape().trim().notEmpty().isEmail(),
    body('phone').escape().trim().notEmpty(),
    body('country').escape().trim().notEmpty(),
    body('city').escape().trim().notEmpty(),
    body('postal_code').escape().trim().notEmpty(),
    body('address').escape().trim().notEmpty(),
    controllers.postSignup);

router.get("/login", controllers.getLogin);
router.post("/login",
    body('email').trim().isEmail().notEmpty().escape(),
    body('passwd').escape().trim().notEmpty().isLength({ min: 8 }),
    controllers.postLogin);
router.get("/confirm/:id", controllers.activateAccount)

module.exports = router;