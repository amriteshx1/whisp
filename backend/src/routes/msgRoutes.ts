import express from "express";
import { protectRoute } from "../middleware/auth";
import { getMsg, getUsers, markSeen } from "../controllers/msgController";

const msgRouter = express.Router();

msgRouter.get("/users", protectRoute, getUsers);
msgRouter.get("/:id", protectRoute, getMsg);
msgRouter.get("mark/:id", protectRoute, markSeen);

export default msgRouter;