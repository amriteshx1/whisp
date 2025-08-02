import express from "express";
import { sendFriendRequest, respondToFriendRequest, getPendingFriendRequests } from "../controllers/friendController";
import { protectRoute } from '../middleware/auth';

const friendRouter = express.Router();

// send friend request
friendRouter.post("/request", protectRoute, sendFriendRequest);
friendRouter.post("/respond", protectRoute, respondToFriendRequest);
friendRouter.get("/requests", protectRoute, getPendingFriendRequests);

export default friendRouter;
