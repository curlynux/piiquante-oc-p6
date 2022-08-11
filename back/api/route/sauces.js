const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const saucesCtrl = require("../controllers/sauces");

router.get("/", auth, saucesCtrl.getSauces);