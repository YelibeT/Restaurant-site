import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  available: { type: Boolean, default: true },
  image: { type: String },
});
const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
