import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import { pool, test } from "./src/utils/db.js";
import { ENV } from "./src/utils/ENV.js";
import cookieParser from "cookie-parser";
import boardRoutes from "./src/routes/board.route.js";
import cardRoutes from "./src/routes/card.route.js";
import columnRoutes from "./src/routes/columns.route.js";
import authRoutes from "./src/routes/auth.route.js";

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" })); //allows you to get the fields from the user
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(
  "/api",
  express
    .Router()
    .get("/", (req, res) => res.json({ message: "Welcome to the API" })),
);
app.use("/api", boardRoutes);
// app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", cardRoutes);
app.use("/api", columnRoutes);
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  test();
});
