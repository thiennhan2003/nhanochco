import { Schema, model } from "mongoose";

const favoriteSchema = new Schema(
  {
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant", // Tham chiếu đến bảng/collection Restaurant
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    versionKey: false, // Loại bỏ __v
    collection: "favorites", // Đặt tên collection trong MongoDB
  }
);

export default model("Favorite", favoriteSchema);
