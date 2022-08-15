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

exports.deleteSauce = (req, res, next) => 
{
  Sauces.findOne({_id: req.params.id})
  .then(sauce => 
  {
    if(!sauce) res.status(404),json({error})
    if(sauce.userId !== req.auth.userId) res.status(401).json({error: new Error("you are not the owner")})
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => 
    {
      Sauces.deleteOne({_id: req.params.id})
      .then(() => {
        res.status(200).json({message: "sauce supprimé !"})
        console.log(`sauce deleted ! id: ${req.params.id}`);
      });
    });
  });
}

exports.likeSauce = (req, res, next) => 
{
  Sauces.findOne({_id: req.params.id})
  .then(sauce => 
  {
    console.log(req.body);
    if(!sauce)
      return res.status(404).json({error: new Error("cette sauce existe pas !")})
    const userLikeIndex = sauce.usersLiked.findIndex((userId) => userId == req.body.userId);
    const userDislikeIndex = sauce.usersDisliked.findIndex((userId) => userId == req.body.userId);
    
    if(req.body.like === 1)
    {
      if(userLikeIndex !== -1)
        return res.status(500).json({error: new Error("user already liked this one !")});
        if(userDislikeIndex !== -1)
        {
          sauce.usersDisliked.splice(userDislikeIndex, 1)
          sauce.dislikes--;
        }
        sauce.usersLiked.push(req.body.userId);
        sauce.like++;
    }
    if(req.body.like === -1)
    {
      if(userDislikeIndex !== -1) 
        return res.status(500).json({error: new Error(" user already disliked this sauce ! ")})
      if(userLikeIndex !== -1)
      {
        sauce.usersLiked.splice(userLikeIndex, 1)
        sauce.likes--;
      }
      sauce.usersDisliked.push(req.body.userId);
      sauce.dislikes++;
    }
    if(req.body.like === 0)
    {
      if(userDislikeIndex !== -1)
      {
        sauce.usersDisliked.splice(userDislikeIndex, 1);
        sauce.dislikes--;
      } 
      else if(userLikeIndex !== -1)
      {
        sauce.usersLiked.splice(userDislikeIndex, 1);
        sauce.dislikes--;
      }
    }
    Sauces.updateOne({_id: req.params.id}, sauce)
    .then(() => res.status(200).json({message: "like enregistré !"}))
  });
}