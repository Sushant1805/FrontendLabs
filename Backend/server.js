require('dotenv').config();
const express = require("express");
const app = express();
require('./config/passport')

const AuthRouter = require('./router/auth-router')
const ProblemRouter = require('./router/problem-router');
const EditorialRouter = require('./router/editorial-router');
const ExecutionRouter = require('./router/execution-router');
const SubmissionRouter = require('./router/submission-router')


const connectDB = require('./utils/db');
const errorMiddleware = require('./Middlewares/error-middleware');
const cookieParser = require("cookie-parser");

var cors = require('cors')

const corsOptions = {
    origin : ["http://localhost:5173", "http://localhost:5174"],
    methods:"GET,POST,PUT,PATCH,DELETE,HEAD",
    credentials : true
}
app.use(cookieParser());
app.use(cors(corsOptions))
app.use(express.json());
app.use('/api/auth',AuthRouter)
app.use(errorMiddleware)
app.use('/api/problems', ProblemRouter);
app.use('/api/editorials',EditorialRouter)
app.use('/api/execute', ExecutionRouter);
app.use('/api/submissions',SubmissionRouter)


const PORT = 5000;
connectDB().then(()=>{
    app.listen(PORT,()=>console.log(`Server is Runnig at ${PORT}`));
})

