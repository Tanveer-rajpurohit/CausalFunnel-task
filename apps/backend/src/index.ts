import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());

connectDb();

app.get("/", (req: Request, res: Response) => {
    res.send("CausalFunnel Backend API is running!");
});


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});