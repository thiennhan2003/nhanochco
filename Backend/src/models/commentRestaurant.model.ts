import { Schema, model } from "mongoose";

const commentRestaurantSchema = new Schema({
    restaurant_id:{
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
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
    collection: "restaurant_comments",
})

export default model("CommentRestaurant", commentRestaurantSchema);
