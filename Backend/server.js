require('dotenv').config();
const express = require("express");
const app = express();
const Authrouter = require('./router/auth-router')
const connectDB = require('./utils/db');
const errorMiddleware = require('./Middlewares/error-middleware');
const cookieParser = require("cookie-parser");
var cors = require('cors')

const corsOptions = {
    origin : ["http://localhost:5173", "http://localhost:5174"],
    methods:"GET,POST,PUT,PATCH,HEAD",
    credentials : true
}
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
app.use('/api/auth',Authrouter)
app.use(errorMiddleware)



const PORT = 5000;
connectDB().then(()=>{
    app.listen(PORT,()=>console.log(`Server is Runnig at ${PORT}`));
})

