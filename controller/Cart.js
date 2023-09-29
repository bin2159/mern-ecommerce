const { Cart } = require("../model/Cart")


exports.fetchCartByUser=async(req,res)=>{
    const {id}=req.user
    try {
        const cart=await Cart.find({user:id}).populate('product')
        res.status(200).json(cart)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

exports.addToCart=async(req,res)=>{
    const {id}=req.user
    const cart=await Cart.create({...req.body,user:id})
    const doc=await cart.populate('product')
    try {
        res.status(201).json(doc)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

exports.deleteFromCart=async(req,res)=>{
    try {
        const cart=await Cart.findByIdAndDelete(req.params.id)
        
        res.status(200).json(cart)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

exports.updateFromCart=async(req,res)=>{
    try {   
        const cart=await Cart.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate('product')
        res.status(200).json(cart)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}