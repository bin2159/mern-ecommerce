const { Order } = require('../model/Orders')

exports.fetchOrderByUser = async (req, res) => {
  try {
    const order = await Order.find({ user: req.query.user })
    res.status(200).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.createOrder = async (req, res) => {
    console.log(req.body)
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
