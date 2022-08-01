import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
var User = mongoose.model("User");

var register = (req, res) =>
{
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, user) => 
    {
        if(err) 
            return res.status(400).send({ message: err });
        else
        {
            user.hash_password = undefined;
            return res.json(user);
        }
    });
}

var sign_in = (req, res) =>
{
    User.findOne({
        email: req.body.email
    }, (err, user) => 
    {
        if(err) throw err;
        if(!user || !user.comparePassword(req.body.password))
            return res.status(401).json({ message: "auth impossible ! invalid user ou mdp" });
        return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, "RESTFULAPIs") });
    });
}

var loginRequired = (req, res, next) =>
{
    if(req.user)
        next();
    else
        return res.status(401).json({ message: "utilisateur non autorisé !" });
}

var profile = (req, res, next) =>
{
    if(req.user)
    {
        res.send(req.user);
        next();
    }
    else
        return res.status(401).json({ message: "token invalide" });
}

export default { register, sign_in, loginRequired, profile }