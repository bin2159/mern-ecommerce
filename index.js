const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy=require('passport-local').Strategy

const { productRouter } = require('./routes/Product')
const { brandRouter } = require('./routes/Brand')
const { categoryRouter } = require('./routes/Category')
const { userRoute } = require('./routes/User')
const { authRoute } = require('./routes/Auth')
const { cartRouter } = require('./routes/Cart')
const { orderRouter } = require('./routes/Order')

const app = express()

app.use(
  session({
    secret: 'keybord cat',
    resave: false,
    saveUninitialize: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
  })
)
app.use(passport.authenticate('sessions'))
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
//this creates session variable req.user on  being called from callbacks
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});
//this changes session variable req.user when called from authorized callbacks
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
}); 
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
)
app.use(express.json())
app.use(morgan('dev'))

app.use('/products', productRouter)
app.use('/brands', brandRouter)
app.use('/categories', categoryRouter)
app.use('/users', userRoute)
app.use('/auth', authRoute)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter)

app.listen(8080, async () => {
  console.log('server started')
  try {
    await mongoose.connect('mongodb://localhost:27017/test', {
      autoIndex: true,
    })
    console.log('connected')
  } catch (error) {
    console.log(error)
  }
})

//unique user not working in signup
