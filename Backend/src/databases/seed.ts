import userModel from "../models/user.model";

const newUser = new userModel({
    username: "admin",
    fullname: "admin",
    email: "admin@gmail.com",
    password: "admin",
    role: ["admin"],
})
newUser.save();
