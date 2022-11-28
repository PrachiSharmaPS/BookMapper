const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: true
    },
    name: {
         type: String,
         required: true, 
         trim:true
        },

    phone: {
        type : String, 
        required: true, 
        unique: true 
        },

    email:  { 
        type : String,
         required:true,
         unique:true
        },
      
    password:{  
        type: String, 
        required: true,
     
        },
    address: {
        street : {type: String},
        city : {type: String},
        pincode: {type: Number},

    }

}, { timestamps: true })



module.exports = mongoose.model('Createuser', userSchema)