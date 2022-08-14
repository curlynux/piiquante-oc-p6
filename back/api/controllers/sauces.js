const Sauces = require("../models/sauces");
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.getSauces = (req, res, next) =>
{
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
}

exports.getOneSauce = (req, res, next) =>
{
    Sauces.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
}

exports.createSauce = (req, res, next) =>
{
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodeToken.userId;

    const sauce = new Sauces({
        ...sauceObjet,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLikes: [],
        userDisliked: [],
        userId: userId
    });
    sauce.save()
    .then(() => res.status(201).json({message: "sauce créé !"}))
    .catch(error => res.status(400).json({error}))
}

exports.modifySauce = (req, res, next) => 
{
    Sauces.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.userId !== req.auth.userId) {
          res.status(403).json({ error: "Unauthorized request" });
        } else if (sauce.userId == req.auth.userId) {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            const sauceObject = req.file
              ? {
                  ...JSON.parse(req.body.sauce),
                  imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                }
              : { ...req.body };
            Sauces.updateOne({ _id: req.params.id },
              { ...sauceObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Sauce modifiée." }))
              .catch((error) => res.status(400).json({ error }));
          });
        }
      })
      .catch((error) => res.status(400).json({ error }));
}

exports.deleteSauce = () => {}