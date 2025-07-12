require('dotenv').config();
const express = require("express");
const app = express();
const router = require('./router/auth-router')
const connectDB = require('./utils/db')


app.use(express.json());
app.use('/api/auth',router)


const PORT = 5000;
connectDB().then(()=>{
    app.listen(PORT,()=>console.log(`Server is Runnig at ${PORT}`));
})

