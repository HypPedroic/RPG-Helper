import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routes/userRoute.js";


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());

app.use(userRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;