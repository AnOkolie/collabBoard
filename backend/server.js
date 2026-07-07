import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import { test } from "./src/db/db.js";
import { ENV } from "./src/utils/env.js";

import boardRoutes from "./src/routes/board.route.js";
import cardRoutes from "./src/routes/card.route.js";
import columnRoutes from "./src/routes/columns.route.js";
import authRoutes from "./src/routes/auth.route.js";
import userRoutes from "./src/routes/user.route.js";
import conversationRoutes from "./src/routes/conversation.route.js";
import messageRoutes from "./src/routes/message.route.js";
import activityRoutes from "./src/routes/activity.route.js";
import friendRoutes from "./src/routes/friends.route.js";
import calendarRoutes from "./src/routes/calendar.route.js";
import dashboardRoutes from "./src/routes/dashboard.route.js";

import { wss, webSocketSetup } from "./src/websockets/socket.js";
import { socketAuthMiddleware } from "./src/middleware/socket.middleware.js";
import { initSubscriber } from "./redis/subscriber.js";

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();
const port = ENV.PORT || 3000;

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
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
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
app.use("/api", messageRoutes);
app.use("/api", conversationRoutes);
app.use("/api", activityRoutes);
app.use("/api", friendRoutes);
app.use("/api", calendarRoutes);
app.use("/api", dashboardRoutes);
const startServer = async () => {
  try {
    console.log("Starting server...");
    await initSubscriber();
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      test();
    });
  } catch (err) {
    console.error("error starting server", err);
  }
};
startServer();
