import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";

import authRouter from "./routes/auth-routes";
import userRouter from "./routes/user-routes";
import moduleRouter from "./routes/module-routes";
import subjectRouter from "./routes/subject-routes";
import courseRouter from "./routes/course-routes";

const app = express();

const morganTemplate = ":remote-user :method :url :status - :response-time ms";

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(morganTemplate));

app.get("/home", (req, res) => res.json("Hello World"));

app.use("/", authRouter);
app.use("/courses", courseRouter);
app.use("/modules", moduleRouter);
app.use("/subjects", subjectRouter);
app.use("/users", userRouter);

export default app;
