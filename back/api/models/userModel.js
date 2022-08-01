import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema

var user = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    hash_password: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

user.methods.comparePassword = (password) => bcrypt.compareSync(password, this.hash_password);
mongoose.model("User", user);
export default user;