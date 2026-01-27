import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";

//add restaurant location too-so maybe the map too,buisness hours
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("Connection failed!", err));

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
