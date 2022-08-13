const Sauces = require("../models/sauces");
const fs = require("fs");

exports.getSauces = (req, res, next) =>
{
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
}