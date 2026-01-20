import express from "express"
import Order from "../models/Order.js"

const router=express.Router();

router.post("/", async(req,res)=>{
    try{
        const{ items, customerName, customerPhone}=req.body;
        if(!items|| items.length===0){
            return res.status(400).json({message: "No items to order"});
        }
        const totalPrice=items.reduce((sum,i)=> sum+i.price*i.quantity,0);
        const order=new Order({items,customerName,customerPhone,totalPrice});
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

export default router;