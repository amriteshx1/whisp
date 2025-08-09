import express from "express";
import { protectRoute } from "../middleware/auth";
import { getMsg, getUsers, markSeen, sendMsg, getNonFriends } from "../controllers/msgController";

const msgRouter = express.Router();

msgRouter.get("/users", protectRoute, getUsers);
msgRouter.get("/nonFriends", protectRoute, getNonFriends);
msgRouter.get("/:id", protectRoute, getMsg);
msgRouter.get("/mark/:id", protectRoute, markSeen);
msgRouter.post("/send/:id", protectRoute, sendMsg);

export default msgRouter;