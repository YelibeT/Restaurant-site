import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
    items:[
        {
            menuItem:{type:mongoose.Schema.Types.ObjectId, ref:"Menu", required:true},
            quantity:{type:Number, default:1},
        }
    ],
    customerName:{type: String, required:true},
    customerPhone:{type: String, required:true},
    totalPrice:{type: Number, required:true},
    status:{type: String, enum:["pending", "completed"],required:true, default:"pending"},
    createdAt:{type: Date, default: Date.now}
})

const Order=mongoose.model("Order", orderSchema);
export default Order;

