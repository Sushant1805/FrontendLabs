require('dotenv').config();
const express = require("express");
const app = express();
const Authrouter = require('./router/auth-router')
const connectDB = require('./utils/db');
const errorMiddleware = require('./Middlewares/error-middleware');
var cors = require('cors')

const corsOptions = {
    origin : "http://localhost:5173",
    methods:"GET,POST,PUT,PATCH,HEAD",
    credentials : true
}
app.use(cors(corsOptions))
app.use(express.json());
app.use('/api/auth',Authrouter)
app.use(errorMiddleware)



const PORT = 5000;
connectDB().then(()=>{
    app.listen(PORT,()=>console.log(`Server is Runnig at ${PORT}`));
})

