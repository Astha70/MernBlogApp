import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is require"],
    },
    image: {
      type: String,
      required: [true, "image is require"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: [true, "user id is required"],
    },
}, 
{
  timestamps: true,
});

const Post = model("Post", PostSchema);

export default Post;