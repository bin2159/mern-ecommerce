const express=require('express')
const { fetchUserById, updateUser } = require('../controller/User')
const router=express.Router()

router.get('/:id',fetchUserById)
router.patch('/:id',updateUser)

exports.userRoute=router