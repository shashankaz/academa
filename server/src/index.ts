import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import router from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(compression());
app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is LIVE!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is healthy!" });
});

app.use("/api/v1", router);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Endpoint Not Found" });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
