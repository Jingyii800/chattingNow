const express = require('express')
const app = express()
const dotenv = require('dotenv')

const PORT = process.env.PORT||5000
//load database connect
const databaseConnect = require('./config/database')
//call route
const authRouter = require('./routes/authRoute')
const chattingnowRouter = require('./routes/chattingnowRoute')
//
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

dotenv.config({
    path: 'backend/config/config.env'
})

app.get('/', (req, res)=>{
    res.send("From backend")
})

app.use(bodyParser.json())
app.use(cookieParser())

//post/get method by authRouter
app.use('/api/chattingnow', authRouter)
app.use('/api/chattingnow', chattingnowRouter)

databaseConnect()

app.listen(PORT, ()=>{
    console.log(`Server is runing on PORT ${PORT}`)
})

