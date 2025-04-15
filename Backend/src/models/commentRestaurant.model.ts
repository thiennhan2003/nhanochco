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
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
        validate: {
          validator: Number.isInteger,
          message: "Rating must be an integer",
        },
      },
},
{
    timestamps: true,
    versionKey: false,
    collection: "restaurant_comments",
})

export default model("CommentRestaurant", commentRestaurantSchema);
