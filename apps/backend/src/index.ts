import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db";
import rootRouter from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'https://causal-funnel-task-dashboard.vercel.app',
        'https://causal-funnel-task-demo-web.vercel.app'
    ],
    credentials: true,
}));
app.use(express.json());

connectDb();

app.get("/", (req: Request, res: Response) => {
    res.send("CausalFunnel Backend API is running!");
});

app.use('/api/v1', rootRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});