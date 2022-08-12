
const mongoose = require("mongoose"); 
const uniqueValidator = require("mongoose-unique-validator")
const Schema = mongoose.Schema

const User = new Schema({
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

User.plugin(uniqueValidator);

module.exports = mongoose.model("User", User);;