import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import MenuItem from "./models/Menu.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Seed function
const seedData = async () => {
  try {
    // 1️⃣ Clear existing data (optional)
    await Category.deleteMany();
    await MenuItem.deleteMany();

    // 2️⃣ Load categories from JSON
    const categoriesData = JSON.parse(fs.readFileSync("./categories.json", "utf-8"));
    const insertedCategories = await Category.insertMany(categoriesData);

    // Map category names to _id for menu items
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // 3️⃣ Load menu items from JSON
    const menuData = JSON.parse(fs.readFileSync("./menu.json", "utf-8"));

    // Replace category names with ObjectIds
    const menuWithIds = menuData.map(item => ({
      ...item,
      category: categoryMap[item.category]
    }));

    // 4️⃣ Insert menu items
    await MenuItem.insertMany(menuWithIds);

    console.log("Categories and menu items inserted successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Run the seed
seedData();
