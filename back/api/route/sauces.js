const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const saucesCtrl = require("../controllers/sauces");
const multer = require("../../middlewares/multer-config");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
router.get("/", auth, saucesCtrl.getSauces);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
module.exports = router;