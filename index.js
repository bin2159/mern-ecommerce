require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto')
const JwtStrategy = require('passport-jwt').Strategy
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path =require('path')

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




const opts = {}
opts.jwtFromRequest = cookieExtrator
opts.secretOrKey = process.env.JWT_SECRET_KEY

const endpointSecret = process.env.ENDPOINT_SECRET;

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_KEY,
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

if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.resolve(__dirname, 'client', 'build')));
  app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'),function (err) {
          if(err) {
              res.status(500).send(err)
          }
      });
  })
}


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
          const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY)
          done(null, { id: user.id, role: user.role,token:token }) //this calls serializer
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
const stripe = require('stripe')(process.env.STRIPE_SERVER_KEY);

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});



app.listen(process.env.PORT, async () => {
  console.log('server started '+process.env.PORT)
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      autoIndex: true,
    })
    console.log('connected')
  } catch (error) {
    // console.log(error)
  }
})
