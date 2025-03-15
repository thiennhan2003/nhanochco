import { Schema, model } from "mongoose";

const commentPostSchema = new Schema({
    post_id:{
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    user_id:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    content:{
        type: String,
        required: true,
        maxlength: [255, "Content must be less than 255 characters long"],
        minlength: [3, "Content must be at least 3 characters long"],
    },
    likeCount:{
        type: Number,
        default: 0,
    },
    dislikeCount:{
        type: Number,
        default: 0,
    },
},
{
    timestamps: true,
    versionKey: false,
    collection: "post_comments",
})

export default model("CommentPost", commentPostSchema);
