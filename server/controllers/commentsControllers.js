import Comment from "../models/Comment.js";
import catchAsync from "../utils/catchAsync.js";
import Post from "../models/Post.js";
import AppError from "../utils/appError.js";

export const addComment = catchAsync(async (req, res, next) => {
  const author = req.user._id;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("Post doesn't exist", 404);
  }

  const comment = await Comment.create({
    content: req.body.content,
    post: postId,
    author,
  });

  res.status(201).json({
    status: "Success",
    data: {
      comment,
    },
  });
});

export const updateComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.id;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("No comment exist", 404);
  }
  if (comment.author !== req.user._id) {
    throw new AppError("You are not authorised for this task", 401);
  }

  comment.content = req.body.content;
  await comment.save();

  res.status(201).json({
    status: "Success",
    data: {
      comment,
    },
  });
});

export const deleteComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.id;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("No comment exist", 404);
  }
  if (comment.author !== req.user._id) {
    throw new AppError("You are not authorised", 401);
  }
  await comment.deleteOne();
  res.status(204);
});
