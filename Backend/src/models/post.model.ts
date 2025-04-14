import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    images:[{ 
        type:String,
    }],
    restaurant_id: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    is_active:{
        type:Boolean,
        default:true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CommentPost",
    }],
    viewCount: {  
        type: Number,
        default: 0,
    },
    likeCount: {
        type: Number,
        default: 0
    },
},
{
    timestamps:true,
    versionKey:false,
    collection:"posts",
}
)
const Post = mongoose.model("Post", postSchema);

export default Post;
