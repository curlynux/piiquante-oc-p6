import express from "express";
import cors from "cors";
const app = express();
import user from "./api/models/userModel.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import routes from "./api/route/userRoute.js";

const options = 
{
    socketTimeoutMS: 30000,
    keepAlive: true
}

const mongoURI = process.env.MONGODB_URI;
mongoose.connect("mongodb://127.0.0.1:27017", options)
.then(() => console.log("mongo est connecté !"), (err) => {if(err) throw err});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => 
{
    if(req.headers && req.headers.authorization && req.headers.authorization.split(" ")[0] === "JWT")
    {
        jwt.verify(req.headers.authorization.split(" ")[1], "RESTFULAPIs", (err, decode) => 
        {
            if(err) req.user = undefined;
            req.user = decode
            next();

        }); 
    } else {
        req.user = undefined;
        next();
    }
});

routes(app);
app.use((req, res) => 
{
    res.status(404).send({ url: req.originalUrl + "not found" })
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get("/", (req, res) => res.json({message: "salut curly !"}));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`server is listening at: ${PORT}`));
export default app;