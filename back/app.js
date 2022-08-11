const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./api/route/userRoute");
const cors = require("cors");

const app = express();
app.use(cors())

app.use("/api/auth", userRoutes)
app.use((req, res, next) => 
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
mongoose.connect("mongodb+srv://spartan:spartan@piiquante.414gato.mongodb.net/?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("connexion a mongodb reussi !"))
.catch(() => console.log("connexion a mongo echoué !"));

app.use(express.json());

module.exports = app;