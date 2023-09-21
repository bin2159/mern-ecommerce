const { Category } = require("../model/Category")

exports.fetchAllCategories=async(req,res)=>{
 try {
    const categories=await Category.find()
    res.status(200).json(categories)
 } catch (error) {
    res.status(400).json({message:error.message})
 }
}

exports.createCategories=async(req,res)=>{
    try {
        const category=await Category.create(req.body)
        res.status(201).json(category)
    } catch (error) {
        res.status(400).json({message:error.message})        
    }
}