const express = require('express')

const { createOrder, fetchOrderByUser, deleteFromOrder, updateFromorder } = require('../controller/Order')
const router = express.Router()

router
  .get('/', fetchOrderByUser)
  .post('/', createOrder)
  .delete('/:id', deleteFromOrder)
  .patch('/:id', updateFromorder)

exports.orderRouter = router
