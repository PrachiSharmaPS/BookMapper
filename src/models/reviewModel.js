const mongoose=require("mongoose")
const objectId= mongoose.Schema.Types.ObjectId

const reviewSchema= new mongoose.Schema({
        bookId: {
            type: objectId,
            ref : "bookCollection",
            require:true,
        },
        reviewedBy:{
            type: String,
            require:true,
            default:"Guest",
        },
        reviewedAt:{
            type: Date,
            require :true
        },
        rating:{type:Number,require:true},
        review:{type:String},
        isDeleted:{type:Boolean,default:false}

},{timestamps:true})

module.exports=mongoose.model('review',reviewSchema)