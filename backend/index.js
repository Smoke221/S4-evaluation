const express = require('express')
const connection = require('./configs/db')
const {authenticate} = require('./middlewares/authenticate')
const {userRouter} = require('./routes/userRoute')
const {postRouter} = require('./routes/postRoute')
const cors = require('cors')

require('dotenv').config()
const app = express()


app.use(express.json())
app.use(cors())

app.get('/',(req,res) => {
    res.send('Home Page')
})

app.use('/users',userRouter)
app.use(authenticate)
app.use('/posts',postRouter)

app.listen(process.env.port,async() => {
    try{
        await connection
        console.log('connected to db');
    }
    catch(err){
        res.send({'error':err.message})
    }
    console.log(`server connected to ${process.env.port}`);
})