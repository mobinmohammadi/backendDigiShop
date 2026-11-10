const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { dbConnect } = require('./utils/db')
const port = process.env.PORT




app.use(cors({
    origin: ['http://localhost:5173','http://localhost:5174'],
    credentials: true
}))



app.use(express.json())
app.use(cookieParser())


app.use('/api', require('./routes/authRoutes'))
app.get("/", (req, res) => res.send("My Backend"))
dbConnect()
app.listen(port, () => console.log(`Server is Running on Port ${port} 🤙`))