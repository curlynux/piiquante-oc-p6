
const mongoose = require("mongoose"); 
const uniqueValidator = require("mongoose-unique-validator")
const Schema = mongoose.Schema

var user = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    password: {
        type: String
    }
});

user.plugin(uniqueValidator);
mongoose.model("User", user);
module.exports = user;