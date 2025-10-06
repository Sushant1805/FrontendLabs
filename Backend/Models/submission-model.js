const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId,required:true},
    problemId : {type:mongoose.Schema.Types.ObjectId,required:true},
    code : {type:String},
    status : {type:String},
    submittedAt : {type:Date,default:Date.now}
})

module.exports = mongoose.model('Submission',submissionSchema)