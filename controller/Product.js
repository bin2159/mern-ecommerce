const { Product } = require('../model/Product')

exports.createProduct = async(req, res) => {
  try{
    const product=await Product.create(req.body)
    res.status(200).json(product)
  }
  catch(error){
    res.status(400).json({message:error.message})
  }
}

exports.fetchAllProducts=async(req,res)=>{
  let query=Product.find({})
  let totalProductsQuery=Product.find({})
  if(req.query.category){
    query=query.find({category:req.query.category})
    totalProductsQuery=totalProductsQuery.find({category:req.query.category})
  }
  if(req.query.brand){
    query=query.find({brand:req.query.brand})
    totalProductsQuery=totalProductsQuery.find({brand:req.query.brand})

  }
  if(req.query._sort&&req.query._order){
    query= query.sort({[req.query._sort]:[req.query._order]})
    totalProductsQuery= totalProductsQuery.sort({[req.query._sort]:[req.query._order]})
    
  }

  const totalProduct=await totalProductsQuery.count().exec()
  if(req.query._page&&req.query._limit){
    const pageSize=req.query._limit
    const page=req.query._page
    query=query.skip(pageSize*(page-1)).limit(pageSize)
  }
  try{
     
    const products=await query.exec()
    res.set('X-Total-Count',totalProduct)
    res.status(200).json(products)
  }
  catch(error){
    res.status(400).json({messgae:error.message})
  }
}

exports.fetchAllProductsById=async(req,res)=>{
  try {
    const product=await Product.findById(req.params.id)
    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({messgae:error.message})
  }
}

exports.updateProduct=async(req,res)=>{
  try {
  const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
  res.status(200).json(product)
    
  } catch (error) {
    res.status(400).json({message:error.message})
  }
}