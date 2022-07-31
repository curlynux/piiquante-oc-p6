import express from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.get("/", (req, res) => res.json({message: "salut curly !"}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is listening at: ${PORT}`));