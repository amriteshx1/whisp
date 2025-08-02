import express from "express";
import { sendFriendRequest } from "../controllers/friendController";
import { protectRoute } from '../middleware/auth';

const friendRouter = express.Router();

// send friend request
friendRouter.post("/request", protectRoute, sendFriendRequest);

export default friendRouter;
