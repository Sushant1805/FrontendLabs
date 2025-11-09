require('dotenv').config();
const express = require("express");
const app = express();
require('./config/passport')

const AuthRouter = require('./router/auth-router')
const ProblemRouter = require('./router/problem-router');
const EditorialRouter = require('./router/editorial-router');
const ExecutionRouter = require('./router/execution-router');
const SubmissionRouter = require('./router/submission-router')
const AiRouter = require('./router/ai-router')


const connectDB = require('./utils/db');
const errorMiddleware = require('./Middlewares/error-middleware');
const cookieParser = require("cookie-parser");

var cors = require('cors')

// Allow configuring frontend origins via env var FRONTEND_URLS (comma-separated).
// Example: FRONTEND_URLS="https://your-frontend.vercel.app,https://staging.example.com"
const FRONTEND_URLS = (process.env.FRONTEND_URLS && process.env.FRONTEND_URLS.split(',')) || ["http://localhost:5173", "https://frontend-labs-dev.vercel.app"];
console.log('Allowed frontend origins:', FRONTEND_URLS);

const corsOptions = {
    origin: FRONTEND_URLS,
    methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
    credentials: true
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
app.use('/api/ai', AiRouter)


const PORT = process.env.PORT || 5000;

connectDB().then(()=>{
    app.listen(PORT,()=>console.log(`Server is Runnig at ${PORT}`));
})

