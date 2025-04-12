import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CommentPost",
    }],
    viewCount: {  // Đổi kiểu thành Number nếu chỉ là số đếm
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
