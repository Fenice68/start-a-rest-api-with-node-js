import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { apiRouter } from "./routes/api.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Middleware di terze parti
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// File statici (dashboard web interattiva)
const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

// Rotte API
app.use("/api", apiRouter);

// Gestione rotte non trovate ed errori
app.use(notFound);
app.use(errorHandler);
