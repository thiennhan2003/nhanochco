import { Schema, model } from "mongoose";

const likeSchema = new Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true,
    versionKey: false,
    collection: "post_likes"
});

// Tạo index để đảm bảo mỗi user chỉ like một post một lần
likeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

// Tạo method để kiểm tra like
likeSchema.statics.findByPostAndUser = async function(post_id: string, user_id: string) {
    return this.findOne({ post_id, user_id });
};

// Tạo method để đếm số like của một post
likeSchema.statics.countByPost = async function(post_id: string) {
    return this.countDocuments({ post_id });
};

export default model("Like", likeSchema); 