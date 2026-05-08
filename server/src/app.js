import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import mesaRouter from "./routes/mesaRoute.js";
import participanteRouter from "./routes/participanteRoute.js";
import sessaoRouter from "./routes/sessaoRoute.js";


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", mesaRouter);
app.use("/api/v1", participanteRouter);
app.use("/api/v1", sessaoRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;