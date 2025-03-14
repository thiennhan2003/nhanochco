import { Schema, model } from "mongoose";

const postSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    title:{
        type:String,
        maxlength:[100,"Password must be less than 100 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
        required:true,
    },
    content:{
        type:String,
        maxlength:[255,"Password must be less than 255 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
        required:true,
    },
    image_url:{
        type:String,
        default:"",
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    likeCount:{
        type:Number,
        default:0,
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"CommentPost",
    }],
    viewCount:{
        type:Number,
        default:0,
    },
    
},
{
    timestamps:true,
    versionKey:false,
    collection:"posts",
}
)
export default model("Post", postSchema);
