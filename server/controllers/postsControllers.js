import Post from "../models/Post.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

//CREATE
export const createPost = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { description, picturePath, location } = req.body;
  const newPost = await Post.create({
    author: req.user._id,
    location: location || user.location,
    description,
    picturePath,
    userPicturePath: user.picturePath,
    likes: {},
  });

  res.status(201).json({
    status: "Success",
    data: {
      post: newPost,
    },
  });
});

//READ
export const getFeedPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();
  res.status(200).json({
    status: "Success",
    data: {
      posts,
    },
  });
});

export const getUserPosts = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const posts = await Post.find({ author: userId });

  res.status(200).json({
    status: "Success",
    data: {
      posts,
    },
  });
});

//Get My Post

export const getMyPost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const posts = await Post.find({ author: userId });

  res.status(200).json({
    status: "Success",
    data: {
      posts,
    },
  });
});

//Like Post
export const likePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById(id);
  if (!post) {
    throw new AppError("No such post found", 404);
  }
  const isLiked = post.likes.get(userId);

  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes: post.likes },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    data: {
      post: updatedPost,
    },
  });
});

//Update Post
export const updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  let post = await Post.findById(postId);
  if (!post) {
    throw new AppError(`No post found with id ${postId}`, 404);
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new AppError(`You are not authorised`, 401);
  }
  const updatedPost = await Post.findByIdAndUpdate(postId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "Success",
    data: {
      post: updatedPost,
    },
    message: "Post has been updated",
  });
});

//Delete Post
export const deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (post.author.toString() !== req.user._id.toString()) {
    throw new AppError("You can't delete the post that you don't own", 401);
  }
  await Post.findByIdAndDelete(postId);
  res.status(204).json({
    status: "Success",
    message: "Post deleted",
  });
});
