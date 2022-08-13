const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const saucesCtrl = require("../controllers/sauces");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
router.get("/", auth, saucesCtrl.getSauces);
module.exports = router;