const express=require('express')
const mongoose=require('mongoose')
const morgan=require('morgan')
const cors=require('cors')

const {productRouter}=require('./routes/Product')
const { brandRouter } = require('./routes/Brand')
const { categoryRouter } = require('./routes/Category')

const app=express()    

app.use(cors({
    exposedHeaders:['X-Total-Count']
}))
app.use(express.json())
app.use(morgan('dev'))


app.use('/products',productRouter)
app.use('/brands',brandRouter)
app.use('/categories',categoryRouter)

app.listen(8080,async()=>{
    console.log('server started')
    try{
        await mongoose.connect('mongodb://localhost:27017/test')
        console.log('connected')
    }
    catch(error){
        console.log(error)
    }
})
