const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>
{
    try
    {
        const token = req.headers.authorization.split(" ")[1];
        const decodeToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodeToken.userId;
        req.auth = { userId: userId }
        next();
    } 
    catch (error)
    {
        console.log(error);
        res.status(401).json({error});
    }
}