import { Schema, model } from "mongoose";

const menuItemSchema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    name: {
      type: String,
      required: true,
      maxlength: [100, "Name must be less than 100 characters long"],
      minlength: [3, "Name must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: true,
      maxlength: [255, "Description must be less than 255 characters long"],
      minlength: [3, "Description must be at least 3 characters long"],
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "CategoryMenuItem",
    },
    price: {
      type: Number,
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "CommentMenu",
      },
    ],
    main_image_url: {
      type: String,
      default: "",
    },
    additional_images: [
      {
        type: String,
        default: "",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "menu_items",
  }
);

export default model("MenuItem", menuItemSchema);