import express, { Request, Response } from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.get("/api/status", (_req: Request, res: Response) => {
  res.send("Server is live");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
