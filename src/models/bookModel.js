const mongoose=require("mongoose")
const objectId= mongoose.Schema.Types.ObjectId

const bookSchema= new mongoose.Schema({
 
        title: {
            type:String,
            require:true,
            unique:true,
            trim:true
        },
        excerpt: {
            type:String,
            require:true,
            trim:true
    }, 
        userId: {
            type:objectId,
            ref:"Createuser"
    },
        ISBN: {type:String,
            require:true,
            unique:true
    },
        category: {
        type:String,
        require:true
    },
        subcategory: {
            type:[String],
            requie:true
        },
        reviews: {
            type:Number, 
            default: 0
        },
        deletedAt: {
           type: Date
        }, 
        isDeleted: {
            type:Boolean, 
            default: false
        },
        releasedAt: {
            type:Date,
            require:true,
            },
        
},{timestamps:true})

module.exports=mongoose.model('bookCollection',bookSchema)
