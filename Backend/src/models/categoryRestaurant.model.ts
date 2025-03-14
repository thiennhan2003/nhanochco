import { Schema, model } from "mongoose";

const categoryRestaurantSchema = new Schema({
    category_name:{
        type:String,
        required:true,
        maxlength:[100,"Password must be less than 100 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
    description:{
        type:String,
        required:true,
        maxlength:[255,"Password must be less than 100 characters long"],
        minlength:[3,"Password must be at least 3 characters long"],
    },
},
{
    timestamps:true,
    versionKey:false,
    collection:"categoryRestaurants",
}
)

export default model("CategoryRestaurant", categoryRestaurantSchema);
