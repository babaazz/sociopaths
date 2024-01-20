import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment can't be empty"],
    },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: [true, "A comment must have a valid author"],
    },
    post: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "post",
      required: [true, "A comment must have an associated post"],
    },
  },
  { timestamps: true }
);

CommentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName picturePath",
  });
  next();
});

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;
