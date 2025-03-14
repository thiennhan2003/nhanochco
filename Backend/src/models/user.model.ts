import { Schema , model } from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        trim:true,
        required:[true,"Username is required"],
        unique:true,
        minlength:[3,"Username must be at least 3 characters long"],
        maxlength:[50,"Username must be less than 20 characters long"],
    },
    fullname:{
        type:String,
        trim:true,
        required:[true,"Fullname is required"],
        minlength:[3,"Fullname must be at least 3 characters long"],
        maxlength:[100,"Fullname must be less than 20 characters long"],
    },
    email:{
        type:String,
        trim:true,
        required:[true,"Email is required"],
        unique:true,
        match:[/^\S+@\S+\.\S+$/,"Please add a valid email"],
        maxlength:[100,"Email must be less than 100 characters long"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,"Password must be at least 8 characters long"],
        maxlength:[100,"Password must be less than 100 characters long"],
    },
    role:{
        type: String,
        required: [true, "Role is required"],
        enum: ["customer", "restaurant_owner", "admin"], 
        default: "customer", 
    },
},
    {
        timestamps: true,
        versionKey: false,
        collection: "users",
    }
)

export default model("User", userSchema);