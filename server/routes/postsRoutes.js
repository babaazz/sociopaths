import express from "express";
import {
  addComment,
  deleteComment,
  updateComment,
} from "../controllers/commentsControllers.js";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  getMyPost,
  updatePost,
  deletePost,
} from "../controllers/postsControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

//READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/me", verifyToken, getMyPost);

//UPDATE
router.patch("/:id", verifyToken, updatePost);
router.patch("/:id/like", verifyToken, likePost);

//DELETE
router.delete("/:id", verifyToken, deletePost);

//Comments
router.post("/:id/comments", verifyToken, addComment);
router.patch("/comments/:id", verifyToken, updateComment);
router.delete("/comments/:id", verifyToken, deleteComment);

export default router;
