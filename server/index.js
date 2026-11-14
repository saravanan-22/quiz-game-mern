import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import { seedIfEmpty } from "./seed/seed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

// Comma-separated list of allowed front-end origins; empty = allow all.
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

//middleWares------------------------------------------------------------------------------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : {}));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/questions", quizRoutes);

//baseServer------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the quiz app.....");
});

// Health check used by the host (Render) and for waking the free instance.
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, db: mongoose.connection.readyState === 1 });
});

//we_received_unknown---------------------------------------------------------------------------------------
app.all("*", (req, res) => {
  res
    .status(404)
    .send(`<h1>Page not found</h1> <a href="/">Click here go to homepage</a>`);
});

//serverPort listen fn--------------------------------------------------------------------------------------
if (!CONNECTION_URL) {
  console.error("CONNECTION_URL is not set. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

mongoose
  .connect(CONNECTION_URL)
  .then(async () => {
    await seedIfEmpty();
    app.listen(PORT, () => {
      console.log(`Server connected to the database and listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
