const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const { productRouter } = require('./routes/Product')
const { brandRouter } = require('./routes/Brand')
const { categoryRouter } = require('./routes/Category')
const { userRoute } = require('./routes/User')
const { authRoute } = require('./routes/Auth')
const { cartRouter } = require('./routes/Cart')
const { orderRouter } = require('./routes/Order')

const app = express()

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
app.use('/cart',cartRouter)
app.use('/orders',orderRouter)


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
