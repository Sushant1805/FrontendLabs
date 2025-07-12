const { json } = require("express");

const home = async(req,res) =>{
    try{
        res.status(200).send("From Controller");
    }catch(err){
        console.log(err);
    }
}

const register = async(req,resp)=>{
    try{
        console.log(req.body);
        resp.status(200).json({"user-data":req.body})
    }catch(err){
        console.log(err);
    }
 
}
module.exports = {home,register};