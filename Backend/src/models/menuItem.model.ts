import { Schema, model } from "mongoose";

const menuItemSchema = new Schema({
    restaurant_id:{
        type:Schema.Types.ObjectId,
        ref:"Restaurant",
    },
    name:{
        type:String,
        required:true,
        maxlength:[100,"Password must be less than 100 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
    description:{
        type:String,
        required:true,
        maxlength:[255,"Password must be less than 255 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
    category_id:{
        type:Schema.Types.ObjectId,
        ref:"CategoryMenuItem",
    },
    price:{
        type:Number,
        required:true,
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"CommentMenu",
    }],
    image_url:{
        type:String,
        default:"",
    },
    
},
{
    timestamps:true,
    versionKey:false,
    collection:"menu_items",
}
)

export default model("MenuItem", menuItemSchema);
