const userTake = require("../controllers/userController.js");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
//router.post("/test1", urlencodedParser, jsonParser, () => userTake.loginRequired, () => userTake.profile)
router.post("/signup", urlencodedParser, jsonParser, userTake.signup)
router.post("/login", urlencodedParser, jsonParser, userTake.login)


module.exports = router;