const express=require('express')
const { createUser, loginUser, checkAuth } = require('../controller/auth')
const passport=require('passport')
const router=express.Router()

router.post('/signup',createUser)
router.post('/login',passport.authenticate('local'),loginUser)
router.get('/checkauth',passport.authenticate('jwt'),checkAuth)


exports.authRoute=router