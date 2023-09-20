const { Brand } = require("../model/Brand")

exports.fetchAllBrands=async(req,res)=>{
    try {
    const brands= await Brand.find({})
        res.status(200).json(brands)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}

exports.createBrands=async(req,res)=>{
    try {
    const brands=await Brand.create(req.body)
      res.status(200).json(brands)  
    } catch (error) {
        res.status(400).json({message:error.message})
    }
    

}