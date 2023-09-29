const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { productRouter } = require('./routes/Product')
const { brandRouter } = require('./routes/Brand')
const { categoryRouter } = require('./routes/Category')
const { userRoute } = require('./routes/User')
const { authRoute } = require('./routes/Auth')
const { cartRouter } = require('./routes/Cart')
const { orderRouter } = require('./routes/Order')
const { User } = require('./model/User')
const { isAuth, sanitizeUser, cookieExtrator } = require('./services/common')

const app = express()

const SECRET_KEY = 'SECRET_KEY'

const opts = {}
opts.jwtFromRequest = cookieExtrator
opts.secretOrKey = SECRET_KEY

app.use(express.static('build'))
app.use(cookieParser())
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.authenticate('session'))
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
)
app.use(express.json())
app.use(morgan('dev'))

app.use('/products', isAuth(), productRouter)
app.use('/brands', isAuth(), brandRouter)
app.use('/categories', isAuth(), categoryRouter)
app.use('/users', isAuth(), userRoute)
app.use('/auth', authRoute)
app.use('/cart', isAuth(), cartRouter)
app.use('/orders', isAuth(), orderRouter)

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email })
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' })
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'Invalid credentials' })
          }
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY)
          done(null, { id: user.id, role: user.role }) //this calls serializer
        }
      )
    } catch (err) {
      done(err)
    }
  })
)
passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    
    try {
      const user = await User.findById( jwt_payload.id )
      if (user) {
        return done(null, sanitizeUser(user)) //this calls serializer
      } else {
        return done(null, false)
      }
    } catch (err) {
      return done({message:'Unauthrized'})
    }
  })
)

passport.serializeUser(function (user, cb) {
  console.log('serialize', user)
  process.nextTick(function () {
    cb(null, user)
  })
})

passport.deserializeUser(function (user, cb) {
  // console.log('deserialize', user)
  process.nextTick(function () {
    return cb(null, user)
  })
})

app.listen(8080, async () => {
  console.log('server started')
  try {
    await mongoose.connect('mongodb://localhost:27017/test', {
      autoIndex: true,
    })
    console.log('connected')
  } catch (error) {
    // console.log(error)
  }
})
