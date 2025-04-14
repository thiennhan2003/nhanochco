import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { TUserEntity } from "../types/model";

const saltRounds = 10;

const defaultAvatars = [
  "http://localhost:3001/uploads/4e6bc970fc4eb15d862d9ecd57a45a4f.jpg",
  "http://localhost:3001/uploads/9b25c466518677b07160af92473c0f32.jpg",
  "http://localhost:3001/uploads/78f9e8bfde385710ab923196a6030cca.jpg",
  "http://localhost:3001/uploads/84c29057479afe81749d1f1c45bbaf0c.jpg",
  "http://localhost:3001/uploads/766f5c35dfcbaeed0c0c01d90e9f8bc7.jpg",
  "http://localhost:3001/uploads/7034dcf02862db22f1e6b6e6c70f8e52.jpg",
  "http://localhost:3001/uploads/2670794f48735cf6ef386684d9a85bd6.jpg",
  "http://localhost:3001/uploads/a80e772779ef8f8251e38c9db74955dd.jpg",
  "http://localhost:3001/uploads/bfc5d75d39164a0ee0e1f287e1dc334b.jpg",
  "http://localhost:3001/uploads/cbf7968ff4b499a53cfd7c1fd00b316c.jpg"
];

const userSchema = new Schema<TUserEntity>(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username must be less than 50 characters long"],
    },
    fullname: {
      type: String,
      trim: true,
      required: [true, "Fullname is required"],
      minlength: [3, "Fullname must be at least 3 characters long"],
      maxlength: [100, "Fullname must be less than 100 characters long"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
      maxlength: [100, "Email must be less than 100 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [100, "Password must be less than 100 characters long"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["customer", "restaurant_owner", "admin"],
      default: "customer",
    },
    active: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: function () {
        return defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
  }
);

// Middleware pre-save for password hashing
userSchema.pre("save", async function (next) {
  const user = this;

  // Skip hashing if the password is not modified
  if (!user.isModified("password")) {
    return next();
  }

  // Hash the password
  user.password = bcrypt.hashSync(user.password, saltRounds);

  next();
});

export default model("User", userSchema);