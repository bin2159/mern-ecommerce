const express=require('express')
const { createProduct, fetchAllProducts, fetchAllProductsById, updateProduct } = require('../controller/Product')
const router=express.Router()

router.post('/',createProduct)
router.get('/',fetchAllProducts)
router.get('/:id',fetchAllProductsById)
router.patch('/:id',updateProduct)

exports.productRouter=router