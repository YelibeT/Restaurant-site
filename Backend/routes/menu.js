import express from "express";
import Category from "../models/Category.js";
import Menu from "../models/Menu.js";

const router = express.Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({ active: true });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/items", async (req, res) => {
  try {
    const {fasting}=req.query;
    const filter={ active: true}
    if( fasting==="true"){
      filter.isFasting=true;
    }
    const items = await MenuItem.find(filter).populate("category", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/search", async(req,res)=>{
  const {q,fasting}=req.query;

  if(!q){
    return res.status(400).json({message: "Query parameter is required"})
  }
  try{
    const filter={
      name:{ $regex:q, $options:"i"},
      active:true
    }
    if(fasting==="true"){
      filter.isFasting=true;
    }
    const results=await Menu.find(filter).populate("category", "menu")
    res.json(results);
  }
  catch(error){
    res.status(500).json({error:error.message})
  }
})

export default router;
