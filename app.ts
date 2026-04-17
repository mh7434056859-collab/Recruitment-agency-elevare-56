import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes";
import { logger } from "./logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

const publicDir = path.resolve(__dirname, "..", "public");
app.use(express.static(publicDir));

app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

export default app;
