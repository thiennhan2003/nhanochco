import { Schema , model } from "mongoose";
import bcrypt from "bcryptjs";
import { TUserEntity } from "../types/model";

const saltRounds = 10;

const userSchema = new Schema<TUserEntity>({
    username:{
        type:String,
        trim:true,
        required:[true,"Username is required"],
        unique:true,
        minlength:[3,"Username must be at least 3 characters long"],
        maxlength:[50,"Username must be less than 50 characters long"], // Fixed message
    },
    fullname:{
        type:String,
        trim:true,
        required:[true,"Fullname is required"],
        minlength:[3,"Fullname must be at least 3 characters long"],
        maxlength:[100,"Fullname must be less than 100 characters long"], // Fixed message
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

//Middleware pre save ở lớp database
//trước khi data được lưu xuống --> mã hóa mật khẩu
userSchema.pre('save', async function (next) {
    const staff = this;

    // Kiểm tra nếu mật khẩu đã được mã hóa
    if (!staff.isModified('password')) {
        return next();
    }

    console.log("Original password before hashing:", staff.password); // Debug log
    const hash = bcrypt.hashSync(staff.password, saltRounds);
    console.log("Hashed password:", hash); // Debug log

    staff.password = hash;

    next();
});

export default model("User", userSchema);