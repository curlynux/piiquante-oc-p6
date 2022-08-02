import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
var User = mongoose.model("User");

var register = (req, res) =>
{
    bcrypt.hash(req.body.password, 10)
    .then(hash => 
    {
        const user = new User({email: req.body.email, password: hash});
        user.save()
        .then(() => res.status(201).json({message: "utilisateur crée !"}))
        .catch(error => res.status(500).json({error}));
    })
}

var sign_in = (req, res) =>
{
    User.findOne({ email: req.body.email }, 
    (err, user) => 
    {
        if(err) throw err;
        if(!user || !user.comparePassword(req.body.password))
            return res.status(401).json({ message: "auth impossible ! invalid user ou mdp" });
        bcrypt.compare(req.body.password, user.password)
        .then(valid => 
            {
                if(!valid) return res.status(401).json({error: "mdp incorrect"})
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign({userId: user._id},
                        "RANDOM_TOKEN_SECRET",
                        {expiresIn: '24h'}
                    )
                });
            }).catch(err => res.status(500).json({err}))
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