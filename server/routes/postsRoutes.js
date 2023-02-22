import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/postsControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

//UPDATE
router.patch("/:id/like", verifyToken, likePost);

export default router;
