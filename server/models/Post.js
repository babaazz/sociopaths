import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "post",
});

postSchema.pre(/^find/, function (next) {
  this.populate("comments");
  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;
