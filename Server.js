import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
import "express-async-errors";
import morgan from "morgan";
import bodyParser from "body-parser";

//db and authenticate User
import connectDB from "./db/connect.js";

//routes
import authRouter from "./routes/authRoutes.js";
import pastPaperRouter from "./routes/pastPapersRoutes.js";
import pdfFilesRouter from "./routes/pdfFilesRoutes.js";

//middlewares
import errorHandleMiddleware from "./middleware/erroHandler.js";
import notFoundMiddleware from "./middleware/notFound.js";
import authenticateUser from "./middleware/auth.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "https://richbrains-site.vercel.app",
      "https://universal-forex-website.vercel.app/",
    ],
    credentials: true,
  })
);

app.get("/api/v1", (req, res) => {
  res.send("Welcome!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/pastpapers", pastPaperRouter);
app.use("/api/v1/pdfs", pdfFilesRouter);
// app.use("/api/v1/pdfs",authenticateUser, pdfFilesRouter);

app.use(notFoundMiddleware);
app.use(errorHandleMiddleware);
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server running on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
