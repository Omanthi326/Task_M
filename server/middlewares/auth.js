import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import taskRouter from "./routes/taskRouter.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

// Improve CORS configuration
app.use(
  cors({
    origin: ["http://13.48.137.48:5173", 'http://localhost:5173'],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })
);

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Set secure options for API routes
app.use((req, res, next) => {
  console.log("Request cookies:", req.cookies);
  next();
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

dbConnection();

app.use(errorMiddleware);

export default app;
