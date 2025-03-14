import { Schema, model } from "mongoose";

const restaurantSchema = new Schema({
    owner_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    menu_id:[{
        type:Schema.Types.ObjectId,
        ref:"MenuItem",
    }],
    name:{
        type:String,
        required:true,
        maxlength:[100,"Password must be less than 100 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
    address:{
        type:String,
        required:true,
        maxlength:[255,"Password must be less than 100 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
    phone:{
        type:Number,
        required:true,
        maxlength:[255,"Password must be less than 100 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
    description:{
        type:String,
        maxlength:[255,"Password must be less than 100 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
    category_id:{
        type:Schema.Types.ObjectId,
        ref:"CategoryRestaurant",
    },
    average_rating:{
        type:Number,
        default:0,
    },
    image_url:{
        type:String,
        default:"",
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"CommentRestaurant",
    }],
    is_active:{
        type:Boolean,
        default:true,
    },
},
{
    timestamps:true,
    versionKey:false,
    collection:"restaurants",
}
)

export default model("Restaurant", restaurantSchema);
