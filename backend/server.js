import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import { test } from "./src/db/db.js";
import { ENV } from "./src/utils/ENV.js";

import boardRoutes from "./src/routes/board.route.js";
import cardRoutes from "./src/routes/card.route.js";
import columnRoutes from "./src/routes/columns.route.js";
import authRoutes from "./src/routes/auth.route.js";
import userRoutes from "./src/routes/user.route.js";

import { wss, webSocketSetup } from "./src/websockets/socket.js";
import { socketAuthMiddleware } from "./src/middleware/socket.middleware.js";
import { initSubscriber } from "./redis/subscriber.js";

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();
const port = process.env.PORT || 3000;

webSocketSetup();

server.on("upgrade", async (req, socket, head) => {
  try {
    const user = await socketAuthMiddleware(req);

    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.user = user;
      wss.emit("connection", ws, req);
    });
  } catch (err) {
    console.error("WebSocket auth failed:", err.message);
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use(
  "/api",
  express
    .Router()
    .get("/", (req, res) => res.json({ message: "Welcome to the API" })),
);
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", boardRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", cardRoutes);
app.use("/api", columnRoutes);

const startServer = async () => {
  initSubscriber();
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    test();
  });
};
startServer();
