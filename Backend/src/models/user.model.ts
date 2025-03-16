import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { TUserEntity } from "../types/model";

const saltRounds = 10;

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
      default: "https://example.com/default-avatar.png", // Replace with your default avatar URL
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