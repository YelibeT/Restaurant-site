import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  active: { type: Boolean, default: true },
});
const Category= new mongoose.model("Category", categorySchema)



export default Category;
