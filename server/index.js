import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import groupChatRouter from './routes/group_chat.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); 
app.use(cookieParser());

app.listen(PORT, () =>
  console.log(`Server started at PORT ${PORT}`)
);

app.use("/auth",authRouter)
app.use("/groupchat",groupChatRouter)