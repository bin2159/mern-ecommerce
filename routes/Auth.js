const express=require('express')
const { createUser, loginUser } = require('../controller/auth')
const router=express.Router()

router.post('/signup',createUser)
router.post('/login',loginUser)

exports.authRoute=router