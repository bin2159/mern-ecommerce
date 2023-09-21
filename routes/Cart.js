const express = require('express')
const {
  fetchCartByUser,
  addToCart,
  deleteFromCart,
  updateFromCart,
} = require('../controller/Cart')
const router = express.Router()

router
  .get('/', fetchCartByUser)
  .post('/', addToCart)
  .delete('/:id', deleteFromCart)
  .patch('/:id', updateFromCart)

exports.cartRouter = router
