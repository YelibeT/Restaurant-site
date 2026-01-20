import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  available: { type: Boolean, default: true },
  isFasting: {type: Boolean, default: false, required: true},
  image: {type:String}
});
const Menu= new mongoose.model("Menu", menuSchema)

export default Menu;
