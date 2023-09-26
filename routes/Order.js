const express = require('express')

const { createOrder, fetchOrderByUser, deleteFromOrder, updateFromorder, fetchAllOrders } = require('../controller/Order')
const router = express.Router()

router
  .get('/user/:userId', fetchOrderByUser)
  .post('/', createOrder)
  .delete('/:id', deleteFromOrder)
  .patch('/:id', updateFromorder)
  .get('/',fetchAllOrders)

exports.orderRouter = router
