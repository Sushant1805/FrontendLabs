const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;



const connectDB = async()=>{
    try{
        await mongoose.connect(URI);
        console.log("Connection To MongoDB Successfull!!");
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;