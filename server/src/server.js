import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



