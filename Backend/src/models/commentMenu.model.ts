import { Schema, model } from "mongoose";

const commentMenuSchema = new Schema({
    menu_id:{
        type:Schema.Types.ObjectId,
        ref:"MenuItem",
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type:String,
        maxlength:[255,"Password must be less than 255 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
    likeCount:{
        type:Number,
        default:0,
    },
    dislikeCount:{
        type:Number,
        default:0,
    },
    // rating: {
    //     type: Number,
    //     required: [true, "Rating is required"],
    //     min: [1, "Rating must be at least 1"],
    //     max: [5, "Rating must be at most 5"],
    //     validate: {
    //       validator: Number.isInteger,
    //       message: "Rating must be an integer",
    //     },
    //   },

},
{
    timestamps:true,
    versionKey:false,
    collection:"menu_comments",
})
export default model("CommentMenu", commentMenuSchema);
