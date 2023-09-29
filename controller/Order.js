const { Order } = require('../model/Orders')

exports.fetchOrderByUser = async (req, res) => {
  const {id}=req.user
  try {
    const order = await Order.find({ user: id})
    res.status(200).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.createOrder = async (req, res) => {
    // console.log(req.body)
  const order = await Order.create(req.body)
  try {
    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteFromOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    res.status(200).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updateFromorder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.status(200).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.fetchAllOrders=async(req,res)=>{
    let query= Order.find({deleted:{$ne:true}})
    let totalOrdersQuery= Order.find({deleted:{$ne:true}})
   
    if(req.query._sort&&req.query._order){
        query=query.sort({[req.query._sort]:[req.query._order]})
        totalOrdersQuery=totalOrdersQuery.sort({[req.query._sort]:[req.query._order]})
    }
    const totalOrders=await totalOrdersQuery.count().exec()
    if(req.query._page&&req.query._limit){
        const pageSize=req.query._limit
        const page=req.query._page
        query=query.skip((page-1)*pageSize).limit(pageSize)
    }
    try {
        const orders=await query.exec()
        res.set('X-Total-Count',totalOrders)
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
}