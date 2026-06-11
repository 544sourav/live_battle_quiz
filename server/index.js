import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import * as http from "http";
import { Server } from "socket.io";
import setupSocket from "./socket/index.js";

import { clerkMiddleware } from "@clerk/express";

import clerkWebHookRouter from "./routes/clerkWebHookRouter.js";
import questionRoute from "./routes/questionRoute.js";
// import userRoute from "./routes/userRoute.js";
import userRoute from "./routes/userRoute.js";
import matchRoute from "./routes/matchRoute.js"
import fileUpload from "express-fileupload";

dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB();
const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  }),
);
cloudinaryConnect();

app.use(clerkMiddleware());

app.use("/api/v1", clerkWebHookRouter);

app.use(express.json());

app.use("/api/v1/question", questionRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/match",matchRoute)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

setupSocket(io);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

server.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
