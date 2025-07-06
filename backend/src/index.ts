import express, { Request, Response } from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDb } from './lib/db';
import userRouter from './routes/userRoutes';

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/auth", userRouter);
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
