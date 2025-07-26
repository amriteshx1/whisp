import express, { Request, Response } from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDb } from './lib/db';
import userRouter from './routes/userRoutes';
import msgRouter from './routes/msgRoutes';
import { Server } from 'socket.io';

//create express and http server
const app = express();
const server = http.createServer(app);

//initialize socket.io
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//store online users
export const userSocketMap: Record<string, string> = {};

//socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  console.log("User connected", userId);

  if(userId) userSocketMap[userId] = socket.id;

  //emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
})

//middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

//routes setup
app.use("/api/auth", userRouter);
app.use("/api/msgs", msgRouter)
app.get("/api/status", (_req: Request, res: Response) => {
  res.send("Server is live");
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDb();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB:",err);
  }
};

startServer();
